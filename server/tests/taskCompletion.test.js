const { validateTaskSubmission, completeTask } = require('../services/taskService');

describe('SkillVault - Task Completion Unit Tests', () => {
  let mockUser;
  let textTask;
  let codeTask;
  let quizTask;

  beforeEach(() => {
    mockUser = {
      id: 'usr_555',
      name: 'Kishore Varma',
      tokens: 40,
      completedTasks: [],
    };

    textTask = {
      id: 'task_text_01',
      title: 'Summarize React Virtual DOM Benefits',
      type: 'text',
      points: 20,
      courseId: 'course_react_101',
    };

    codeTask = {
      id: 'task_code_01',
      title: 'Implement Express GET Route',
      type: 'code',
      points: 35,
      courseId: 'course_node_201',
    };

    quizTask = {
      id: 'task_quiz_01',
      title: 'MongoDB Query Fundamentals Quiz',
      type: 'quiz',
      points: 25,
      questions: [
        { id: 'q1', question: 'Find all documents', correctAnswer: 'find' },
        { id: 'q2', question: 'Update one document', correctAnswer: 'updateOne' },
      ],
      courseId: 'course_mongo_301',
    };
  });

  describe('1. Task Submission Validation', () => {
    test('should validate valid text submission', () => {
      const validSubmission = {
        userId: 'usr_555',
        content: 'The React Virtual DOM optimizes performance by computing diffs in memory before flushing changes to real DOM.',
      };

      const result = validateTaskSubmission(textTask, validSubmission);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject empty or overly short text submission', () => {
      const emptySubmission = { userId: 'usr_555', content: '' };
      const shortSubmission = { userId: 'usr_555', content: 'Too short' };

      const emptyRes = validateTaskSubmission(textTask, emptySubmission);
      expect(emptyRes.isValid).toBe(false);
      expect(emptyRes.errors).toContain('Text submission content cannot be empty.');

      const shortRes = validateTaskSubmission(textTask, shortSubmission);
      expect(shortRes.isValid).toBe(false);
      expect(shortRes.errors).toContain('Text submission must be at least 15 characters long.');
    });

    test('should validate valid code submission', () => {
      const validCodeSubmission = {
        userId: 'usr_555',
        code: 'app.get("/api/health", (req, res) => res.json({ status: "ok" }));',
      };

      const result = validateTaskSubmission(codeTask, validCodeSubmission);
      expect(result.isValid).toBe(true);
    });

    test('should reject code submission when code is empty or missing', () => {
      const emptyCodeSubmission = { userId: 'usr_555', code: '   ' };
      const result = validateTaskSubmission(codeTask, emptyCodeSubmission);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Code submission cannot be empty.');
    });

    test('should reject submission missing userId', () => {
      const missingUserSubmission = {
        content: 'Valid content that is sufficiently long for verification.',
      };

      const result = validateTaskSubmission(textTask, missingUserSubmission);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('User ID is required for task submission.');
    });
  });

  describe('2. Task Completion & Token Award Execution', () => {
    test('should complete text task and award correct tokens to user', () => {
      const submission = {
        userId: 'usr_555',
        content: 'React uses declarative components and reconciles virtual trees to minimize actual DOM reflows.',
      };

      const result = completeTask(mockUser, textTask, submission);

      expect(result.success).toBe(true);
      expect(result.taskStatus).toBe('completed');
      expect(result.tokensAwarded).toBe(20);
      expect(result.newBalance).toBe(60); // 40 + 20
      expect(mockUser.tokens).toBe(60);
      expect(mockUser.completedTasks).toHaveLength(1);
    });

    test('should complete code task and award correct tokens to user', () => {
      const submission = {
        userId: 'usr_555',
        code: 'app.post("/tasks", async (req, res) => { res.status(201).send(); });',
      };

      const result = completeTask(mockUser, codeTask, submission);

      expect(result.success).toBe(true);
      expect(result.taskStatus).toBe('completed');
      expect(result.tokensAwarded).toBe(35);
      expect(result.newBalance).toBe(75); // 40 + 35
      expect(mockUser.tokens).toBe(75);
    });

    test('should reject incomplete submission, not award tokens, and leave balance intact', () => {
      const invalidSubmission = { userId: 'usr_555', content: '' };

      const result = completeTask(mockUser, textTask, invalidSubmission);

      expect(result.success).toBe(false);
      expect(result.taskStatus).toBe('rejected');
      expect(result.tokensAwarded).toBe(0);
      expect(result.newBalance).toBe(40);
      expect(mockUser.tokens).toBe(40);
      expect(mockUser.completedTasks).toHaveLength(0);
    });

    test('should fail task when quiz answers fail passing threshold and award 0 tokens', () => {
      const failingQuizSubmission = {
        userId: 'usr_555',
        answers: {
          q1: 'wrong_answer',
          q2: 'wrong_answer_2',
        },
      };

      const result = completeTask(mockUser, quizTask, failingQuizSubmission);

      expect(result.success).toBe(false);
      expect(result.taskStatus).toBe('failed');
      expect(result.score).toBe(0);
      expect(result.tokensAwarded).toBe(0);
      expect(mockUser.tokens).toBe(40); // unchanged
    });
  });
});
