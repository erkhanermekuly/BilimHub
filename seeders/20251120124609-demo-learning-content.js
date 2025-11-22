'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Создаем темы
    await queryInterface.bulkInsert('themes', [
      {
        title: 'Основы программирования',
        description: 'Введение в мир программирования. Изучите базовые концепции и начните свой путь разработчика.',
        image: '/images/programming-basics.jpg',
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'JavaScript для начинающих',
        description: 'Изучите основы JavaScript - самого популярного языка программирования для веб-разработки.',
        image: '/images/javascript.jpg',
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Лекции для темы "Основы программирования"
    await queryInterface.bulkInsert('lectures', [
      {
        themeId: 1,
        title: 'Что такое программирование?',
        content: '# Что такое программирование?\n\nПрограммирование - это процесс создания компьютерных программ. Программа - это набор инструкций, которые говорят компьютеру, что делать.\n\n## Основные концепции:\n- **Алгоритм** - последовательность шагов для решения задачи\n- **Код** - текст программы на языке программирования\n- **Переменная** - место для хранения данных\n- **Функция** - блок кода, выполняющий определенную задачу',
        videoUrl: 'https://www.youtube.com/watch?v=example1',
        order: 1,
        duration: 15,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        themeId: 1,
        title: 'Переменные и типы данных',
        content: '# Переменные и типы данных\n\nПеременная - это именованное место в памяти компьютера, где хранятся данные.\n\n## Типы данных:\n- **Числа** (Number): 1, 2.5, -10\n- **Строки** (String): "Hello", "World"\n- **Логические** (Boolean): true, false',
        videoUrl: 'https://www.youtube.com/watch?v=example2',
        order: 2,
        duration: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Тесты для первой лекции
    await queryInterface.bulkInsert('tests', [
      { lectureId: 1, title: 'Тест 1: Основы программирования', testNumber: 1, passingScore: 70, timeLimit: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { lectureId: 1, title: 'Тест 2: Основы программирования', testNumber: 2, passingScore: 70, timeLimit: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { lectureId: 2, title: 'Тест 1: Переменные', testNumber: 1, passingScore: 70, timeLimit: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { lectureId: 2, title: 'Тест 2: Переменные', testNumber: 2, passingScore: 70, timeLimit: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Вопросы для тестов
    await queryInterface.bulkInsert('questions', [
      { testId: 1, question: 'Что такое алгоритм?', type: 'single', points: 1, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { testId: 1, question: 'Что такое переменная?', type: 'single', points: 1, order: 2, createdAt: new Date(), updatedAt: new Date() },
      { testId: 2, question: 'Что такое программа?', type: 'single', points: 1, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { testId: 3, question: 'Какой тип данных у "Hello"?', type: 'single', points: 1, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { testId: 3, question: 'Какой тип данных у true?', type: 'single', points: 1, order: 2, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Ответы
    await queryInterface.bulkInsert('answers', [
      { questionId: 1, answer: 'Последовательность шагов для решения задачи', isCorrect: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 1, answer: 'Тип данных', isCorrect: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 2, answer: 'Место для хранения данных', isCorrect: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 2, answer: 'Функция программы', isCorrect: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 3, answer: 'Набор инструкций для компьютера', isCorrect: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 3, answer: 'Операционная система', isCorrect: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 4, answer: 'String', isCorrect: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 4, answer: 'Number', isCorrect: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 5, answer: 'Boolean', isCorrect: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
      { questionId: 5, answer: 'String', isCorrect: false, order: 2, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('answers', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('tests', null, {});
    await queryInterface.bulkDelete('lectures', null, {});
    await queryInterface.bulkDelete('themes', null, {});
  }
};
