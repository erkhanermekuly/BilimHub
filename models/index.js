const User = require('./User');
const Theme = require('./Theme');
const Lecture = require('./Lecture');
const Test = require('./Test');
const Question = require('./Question');
const Answer = require('./Answer');
const UserProgress = require('./UserProgress');
const UserRating = require('./UserRating');

Theme.hasMany(Lecture, { foreignKey: 'themeId', as: 'lectures' });
Lecture.belongsTo(Theme, { foreignKey: 'themeId', as: 'theme' });

Lecture.hasMany(Test, { foreignKey: 'lectureId', as: 'tests' });
Test.belongsTo(Lecture, { foreignKey: 'lectureId', as: 'lecture' });

Test.hasMany(Question, { foreignKey: 'testId', as: 'questions' });
Question.belongsTo(Test, { foreignKey: 'testId', as: 'test' });

Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

User.hasMany(UserProgress, { foreignKey: 'userId', as: 'progress' });
UserProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Lecture.hasMany(UserProgress, { foreignKey: 'lectureId', as: 'userProgress' });
UserProgress.belongsTo(Lecture, { foreignKey: 'lectureId', as: 'lecture' });

User.hasOne(UserRating, { foreignKey: 'userId', as: 'rating' });
UserRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    User,
    Theme,
    Lecture,
    Test,
    Question,
    Answer,
    UserProgress,
    UserRating
};
