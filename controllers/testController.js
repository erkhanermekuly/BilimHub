const { Test, Question, Answer, Lecture, UserProgress, UserRating } = require('../models');

exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    const test = await Test.findByPk(id, {
      include: [
        {
          model: Lecture,
          as: 'lecture'
        },
        {
          model: Question,
          as: 'questions',
          include: [{
            model: Answer,
            as: 'answers',
            attributes: ['id', 'answer', 'order'] 
          }],
          order: [['order', 'ASC']]
        }
      ]
    });
    
    if (!test) {
      return res.status(404).json({ error: 'Тест не найден' });
    }
    
    const hasAccess = await checkTestAccess(userId, test);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Доступ к тесту закрыт' });
    }
    
    res.json(test);
  } catch (error) {
    console.error('❌ Error getting test:', error);
    res.status(500).json({ error: 'Ошибка при получении теста' });
  }
};

async function checkTestAccess(userId, test) {
  const progress = await UserProgress.findOne({
    where: {
      userId,
      lectureId: test.lectureId
    }
  });
  
  if (!progress) {
    return test.testNumber === 1;
  }
  
  if (progress.test1Score >= test.passingScore && test.testNumber === 2) {
    return false;
  }
  
  if (progress.test1Score < test.passingScore && test.testNumber === 2) {
    return true;
  }
  
  return test.testNumber === 1;
}

exports.checkTestAccessPublic = async (userId, test) => {
  return await checkTestAccess(userId, test);
};

exports.submitTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; 
    const userId = req.session.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Неверный формат ответов' });
    }
    
    const test = await Test.findByPk(id, {
      include: [{
        model: Question,
        as: 'questions',
        include: [{
          model: Answer,
          as: 'answers'
        }]
      }]
    });
    
    if (!test) {
      return res.status(404).json({ error: 'Тест не найден' });
    }
    
    let totalScore = 0;
    let maxScore = 0;
    const results = [];
    
    for (const question of test.questions) {
      maxScore += question.points;
      
      const userAnswerIds = answers[question.id] || [];
      const correctAnswerIds = question.answers
        .filter(a => a.isCorrect)
        .map(a => a.id);
      
      const isCorrect = 
        userAnswerIds.length === correctAnswerIds.length &&
        userAnswerIds.every(id => correctAnswerIds.includes(id));
      
      if (isCorrect) {
        totalScore += question.points;
      }
      
      results.push({
        questionId: question.id,
        isCorrect,
        correctAnswers: correctAnswerIds
      });
    }
    
    const scorePercentage = Math.round((totalScore / maxScore) * 100);
    
    let progress = await UserProgress.findOne({
      where: {
        userId,
        lectureId: test.lectureId
      }
    });
    
    if (!progress) {
      progress = await UserProgress.create({
        userId,
        lectureId: test.lectureId,
        testNumber: test.testNumber,
        attempts: 0
      });
    }
    
    if (test.testNumber === 1) {
      progress.test1Score = scorePercentage;
      progress.attempts += 1;
      
      if (scorePercentage >= test.passingScore) {
        progress.isCompleted = true;
        progress.completedAt = new Date();
        await unlockNextLecture(userId, test.lectureId);
        await updateUserRating(userId, scorePercentage);
      }
    } else if (test.testNumber === 2) {
      progress.test2Score = scorePercentage;
      progress.attempts += 1;
      
      if (scorePercentage >= test.passingScore) {
        progress.isCompleted = true;
        progress.completedAt = new Date();
        await unlockNextLecture(userId, test.lectureId);
        await updateUserRating(userId, scorePercentage);
      }
    }
    
    await progress.save();
    
    console.log(`✅ Test ${test.testNumber} completed by user ${userId}: ${scorePercentage}%`);
    
    res.json({
      score: scorePercentage,
      totalScore,
      maxScore,
      passed: scorePercentage >= test.passingScore,
      passingScore: test.passingScore,
      results,
      needTest2: test.testNumber === 1 && scorePercentage < test.passingScore
    });
  } catch (error) {
    console.error('❌ Error submitting test:', error);
    res.status(500).json({ error: 'Ошибка при отправке теста' });
  }
};

async function unlockNextLecture(userId, lectureId) {
  const currentLecture = await Lecture.findByPk(lectureId);
  
  const lectures = await Lecture.findAll({
    where: {
      themeId: currentLecture.themeId,
      isActive: true
    },
    order: [['order', 'ASC']]
  });
  
  const currentIndex = lectures.findIndex(l => l.id === lectureId);
  
  if (currentIndex < lectures.length - 1) {
    const nextLecture = lectures[currentIndex + 1];
    console.log(`🔓 Next lecture unlocked: ${nextLecture.title}`);
  } else {
    console.log('✅ Theme completed!');
  }
}

async function updateUserRating(userId, score) {
  let rating = await UserRating.findOne({ where: { userId } });
  
  if (!rating) {
    rating = await UserRating.create({
      userId,
      totalScore: 0,
      completedLectures: 0,
      completedTests: 0
    });
  }
  
  rating.totalScore += score;
  rating.completedTests += 1;
  rating.completedLectures += 1;
  
  if (rating.totalScore >= 1000) {
    rating.level = 'Эксперт';
  } else if (rating.totalScore >= 500) {
    rating.level = 'Продвинутый';
  } else if (rating.totalScore >= 200) {
    rating.level = 'Средний';
  } else {
    rating.level = 'Новичок';
  }
  
  await rating.save();
  
  console.log(`📊 Rating updated for user ${userId}: ${rating.totalScore} points, level: ${rating.level}`);
}

exports.createTest = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, testNumber, passingScore, timeLimit, questions } = req.body;
    
    if (!title || !testNumber) {
      return res.status(400).json({ error: 'Название и номер теста обязательны' });
    }
    
    const lecture = await Lecture.findByPk(lectureId);
    if (!lecture) {
      return res.status(404).json({ error: 'Лекция не найдена' });
    }
    
    const test = await Test.create({
      lectureId,
      title,
      testNumber,
      passingScore: passingScore || 70,
      timeLimit
    });
    
    if (questions && Array.isArray(questions)) {
      for (const q of questions) {
        const question = await Question.create({
          testId: test.id,
          question: q.question,
          type: q.type || 'single',
          points: q.points || 1,
          order: q.order || 0
        });
        
        if (q.answers && Array.isArray(q.answers)) {
          for (const a of q.answers) {
            await Answer.create({
              questionId: question.id,
              answer: a.answer,
              isCorrect: a.isCorrect,
              order: a.order || 0
            });
          }
        }
      }
    }
    
    console.log('✅ Test created:', test.title);
    res.status(201).json(test);
  } catch (error) {
    console.error('❌ Error creating test:', error);
    res.status(500).json({ error: 'Ошибка при создании теста' });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, testNumber, passingScore, timeLimit, questions } = req.body;

    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ error: 'Тест не найден' });
    }

    test.title = title;
    test.testNumber = testNumber;
    test.passingScore = passingScore || 70;
    test.timeLimit = timeLimit;
    await test.save();

    await Question.destroy({ where: { testId: test.id } });

    if (questions && Array.isArray(questions)) {
      for (const q of questions) {
        const question = await Question.create({
          testId: test.id,
          question: q.question,
          type: q.type || 'single',
          points: q.points || 1,
          order: q.order || 0
        });

        if (q.answers && Array.isArray(q.answers)) {
          for (const a of q.answers) {
            await Answer.create({
              questionId: question.id,
              answer: a.answer,
              isCorrect: a.isCorrect,
              order: a.order || 0
            });
          }
        }
      }
    }

    console.log('✅ Test updated:', test.title);
    res.json(test);
  } catch (error) {
    console.error('❌ Error updating test:', error);
    res.status(500).json({ error: 'Ошибка при обновлении теста' });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ error: 'Тест не найден' });
    }

    await Question.destroy({ where: { testId: test.id } });
    await test.destroy();

    console.log('✅ Test deleted:', test.title);
    res.json({ message: 'Тест успешно удален' });
  } catch (error) {
    console.error('❌ Error deleting test:', error);
    res.status(500).json({ error: 'Ошибка при удалении теста' });
  }
};

exports.getRatings = async (req, res) => {
  try {
    const ratings = await UserRating.findAll({
      include: [{
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['totalScore', 'DESC']],
      limit: 100
    });
    
    for (let i = 0; i < ratings.length; i++) {
      ratings[i].rank = i + 1;
      await ratings[i].save();
    }
    
    res.json(ratings);
  } catch (error) {
    console.error('❌ Error getting ratings:', error);
    res.status(500).json({ error: 'Ошибка при получении рейтинга' });
  }
};
