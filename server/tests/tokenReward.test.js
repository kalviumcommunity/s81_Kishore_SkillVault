const {
  calculateTokensForTask,
  awardTokensToUser,
  deductTokensFromUser,
  getUserTokenBalance,
} = require('../services/tokenService');

describe('SkillVault - Token Reward System Unit Tests', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      id: 'user_123',
      name: 'Kishore Varma',
      tokens: 50,
      completedTasks: [],
    };
  });

  describe('1. Token Calculation for Tasks', () => {
    test('should calculate correct tokens for a valid completed task', () => {
      const task = { id: 'task_react_01', points: 25, type: 'text' };
      const submissionResult = { isValid: true, passed: true };

      const tokens = calculateTokensForTask(task, submissionResult);
      expect(tokens).toBe(25);
    });

    test('should return 0 tokens when task completion is invalid or failed', () => {
      const task = { id: 'task_react_02', points: 30, type: 'quiz' };
      const failedResult = { isValid: true, passed: false, score: 40 };

      const tokens = calculateTokensForTask(task, failedResult);
      expect(tokens).toBe(0);
    });

    test('should return 0 tokens when submission is marked invalid', () => {
      const task = { id: 'task_react_03', points: 20, type: 'code' };
      const invalidResult = { isValid: false, passed: false };

      const tokens = calculateTokensForTask(task, invalidResult);
      expect(tokens).toBe(0);
    });

    test('should apply a 20% bonus for a perfect 100% quiz score', () => {
      const quizTask = { id: 'quiz_js_01', points: 50, type: 'quiz' };
      const perfectResult = { isValid: true, passed: true, score: 100 };

      const tokens = calculateTokensForTask(quizTask, perfectResult);
      // 50 base points + 20% bonus (10 points) = 60
      expect(tokens).toBe(60);
    });
  });

  describe('2. Awarding Tokens to User', () => {
    test('should award tokens and correctly increment user balance', () => {
      const result = awardTokensToUser(mockUser, 30, {
        taskId: 'task_react_01',
        courseId: 'course_fullstack_01',
      });

      expect(result.success).toBe(true);
      expect(result.tokensAwarded).toBe(30);
      expect(result.currentBalance).toBe(80); // 50 + 30
      expect(mockUser.tokens).toBe(80);
      expect(mockUser.completedTasks).toHaveLength(1);
      expect(mockUser.completedTasks[0].taskId).toBe('task_react_01');
      expect(mockUser.completedTasks[0].tokensEarned).toBe(30);
    });

    test('should reject invalid or negative token amounts and not modify balance', () => {
      const resultNegative = awardTokensToUser(mockUser, -10);
      expect(resultNegative.success).toBe(false);
      expect(mockUser.tokens).toBe(50);

      const resultZero = awardTokensToUser(mockUser, 0);
      expect(resultZero.success).toBe(false);
      expect(mockUser.tokens).toBe(50);

      const resultNaN = awardTokensToUser(mockUser, 'twenty');
      expect(resultNaN.success).toBe(false);
      expect(mockUser.tokens).toBe(50);
    });

    test('should throw an error if user object is not provided', () => {
      expect(() => awardTokensToUser(null, 20)).toThrow('User is required to award tokens');
    });
  });

  describe('3. Deducting Tokens from User', () => {
    test('should deduct tokens successfully when user has sufficient balance', () => {
      const result = deductTokensFromUser(mockUser, 20, 'course_unlock');

      expect(result.success).toBe(true);
      expect(result.deducted).toBe(20);
      expect(result.remainingBalance).toBe(30); // 50 - 20
      expect(mockUser.tokens).toBe(30);
    });

    test('should reject deduction when user has insufficient tokens and keep balance unchanged', () => {
      const result = deductTokensFromUser(mockUser, 100, 'premium_course');

      expect(result.success).toBe(false);
      expect(result.remainingBalance).toBe(50);
      expect(result.shortfall).toBe(50);
      expect(mockUser.tokens).toBe(50);
      expect(result.message).toContain('Insufficient tokens');
    });

    test('should accurately report balance via getUserTokenBalance helper', () => {
      expect(getUserTokenBalance(mockUser)).toBe(50);
      mockUser.tokens = 125;
      expect(getUserTokenBalance(mockUser)).toBe(125);
      expect(getUserTokenBalance(null)).toBe(0);
    });
  });
});
