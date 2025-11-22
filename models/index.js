const User = require('./User');
const Theme = require('./Theme');
const Lecture = require('./Lecture');
const Test = require('./Test');
const Question = require('./Question');
const Answer = require('./Answer');
const UserProgress = require('./UserProgress');
const UserRating = require('./UserRating');

// Theme <-> Lecture (One to Many)
Theme.hasMany(Lecture, { foreignKey: 'themeId', as: 'lectures' });
Lecture.belongsTo(Theme, { foreignKey: 'themeId', as: 'theme' });

// Lecture <-> Test (One to Many)
Lecture.hasMany(Test, { foreignKey: 'lectureId', as: 'tests' });
Test.belongsTo(Lecture, { foreignKey: 'lectureId', as: 'lecture' });

// Test <-> Question (One to Many)
Test.hasMany(Question, { foreignKey: 'testId', as: 'questions' });
Question.belongsTo(Test, { foreignKey: 'testId', as: 'test' });

// Question <-> Answer (One to Many)
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// User <-> UserProgress (One to Many)
User.hasMany(UserProgress, { foreignKey: 'userId', as: 'progress' });
UserProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Lecture <-> UserProgress (One to Many)
Lecture.hasMany(UserProgress, { foreignKey: 'lectureId', as: 'userProgress' });
UserProgress.belongsTo(Lecture, { foreignKey: 'lectureId', as: 'lecture' });

// User <-> UserRating (One to One)
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
