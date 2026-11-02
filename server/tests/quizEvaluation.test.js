const { evaluateQuiz } = require('../services/quizService');

describe('SkillVault - Quiz Evaluation Unit Tests', () => {
  const sampleQuestions = [
    {
      id: 'q1',
      question: 'Which hook is used for managing state in a React functional component?',
      correctAnswer: 'useState',
      points: 10,
    },
    {
      id: 'q2',
      question: 'What runtime environment allows executing JavaScript on the server?',
      correctAnswer: 'Node.js',
      points: 10,
    },
    {
      id: 'q3',
      question: 'Which NoSQL database uses BSON format for document storage?',
      correctAnswer: 'MongoDB',
      points: 10,
    },
    {
      id: 'q4',
      question: 'What HTTP method is commonly used to update an existing resource?',
      correctAnswer: 'PUT',
      points: 10,
    },
  ];

  test('should evaluate all correct answers and return 100% score with passed=true', () => {
    const perfectAnswers = {
      q1: 'useState',
      q2: 'Node.js',
      q3: 'MongoDB',
      q4: 'PUT',
    };

    const result = evaluateQuiz(sampleQuestions, perfectAnswers, 70);

    expect(result.isValid).toBe(true);
    expect(result.score).toBe(100);
    expect(result.totalQuestions).toBe(4);
    expect(result.correctCount).toBe(4);
    expect(result.incorrectCount).toBe(0);
    expect(result.passed).toBe(true);
    expect(result.message).toContain('Quiz passed with score 100%');
  });

  test('should accurately calculate partial scores matching correct answer count', () => {
    const halfCorrectAnswers = {
      q1: 'useState', // correct
      q2: 'Python',   // incorrect (expected Node.js)
      q3: 'MongoDB',  // correct
      q4: 'GET',      // incorrect (expected PUT)
    };

    const result = evaluateQuiz(sampleQuestions, halfCorrectAnswers, 70);

    expect(result.isValid).toBe(true);
    expect(result.correctCount).toBe(2);
    expect(result.incorrectCount).toBe(2);
    expect(result.score).toBe(50); // 2/4 = 50%
    expect(result.passed).toBe(false); // 50% < 70% threshold
    expect(result.message).toContain('Quiz failed with score 50%');
  });

  test('should handle answers in a case-insensitive manner and trim extraneous whitespace', () => {
    const answersWithVariedCasing = {
      q1: '  usestate  ', // lowercase and spaces
      q2: 'NODE.JS',       // uppercase
      q3: 'mongodb ',      // trailing space
      q4: ' put',          // leading space
    };

    const result = evaluateQuiz(sampleQuestions, answersWithVariedCasing, 70);

    expect(result.isValid).toBe(true);
    expect(result.correctCount).toBe(4);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
  });

  test('should mark quiz as passed when score meets custom passing threshold', () => {
    const threeOutOfFour = {
      q1: 'useState',
      q2: 'Node.js',
      q3: 'MongoDB',
      q4: 'POST', // incorrect
    };

    // 3/4 = 75%, passing threshold is 70%
    const result = evaluateQuiz(sampleQuestions, threeOutOfFour, 70);
    expect(result.score).toBe(75);
    expect(result.passed).toBe(true);

    // If passing threshold is raised to 80%, 75% should fail
    const strictResult = evaluateQuiz(sampleQuestions, threeOutOfFour, 80);
    expect(strictResult.score).toBe(75);
    expect(strictResult.passed).toBe(false);
  });

  test('should reject invalid or missing inputs gracefully', () => {
    const emptyQuestionsResult = evaluateQuiz([], { q1: 'a' });
    expect(emptyQuestionsResult.isValid).toBe(false);
    expect(emptyQuestionsResult.passed).toBe(false);

    const nullAnswersResult = evaluateQuiz(sampleQuestions, null);
    expect(nullAnswersResult.isValid).toBe(false);
    expect(nullAnswersResult.correctCount).toBe(0);
    expect(nullAnswersResult.score).toBe(0);
    expect(nullAnswersResult.passed).toBe(false);
  });
});
