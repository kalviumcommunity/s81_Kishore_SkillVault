const { canUnlockCourse, unlockCourse } = require('../services/courseUnlockService');

describe('SkillVault - Course Unlocking Unit Tests', () => {
  let mockUser;
  let premiumCourse;
  let freeCourse;

  beforeEach(() => {
    mockUser = {
      id: 'user_101',
      name: 'Kishore Varma',
      tokens: 60,
      unlockedCourses: [],
    };

    premiumCourse = {
      _id: 'course_ai_99',
      title: 'AI & Machine Learning Mastery',
      isPremium: true,
      tokenCost: 40,
    };

    freeCourse = {
      _id: 'course_web_01',
      title: 'Intro to React',
      isPremium: false,
      tokenCost: 0,
    };
  });

  describe('1. Eligibility Check (canUnlockCourse)', () => {
    test('should allow unlocking when user has sufficient tokens for premium course', () => {
      const eligibility = canUnlockCourse(mockUser, premiumCourse);
      expect(eligibility.canUnlock).toBe(true);
      expect(eligibility.requiredTokens).toBe(40);
    });

    test('should reject unlocking when user has insufficient tokens', () => {
      mockUser.tokens = 25; // 25 < 40
      const eligibility = canUnlockCourse(mockUser, premiumCourse);
      expect(eligibility.canUnlock).toBe(false);
      expect(eligibility.shortfall).toBe(15);
      expect(eligibility.reason).toContain('Insufficient tokens');
    });

    test('should always allow unlocking a free course regardless of user tokens', () => {
      mockUser.tokens = 0;
      const eligibility = canUnlockCourse(mockUser, freeCourse);
      expect(eligibility.canUnlock).toBe(true);
      expect(eligibility.requiredTokens).toBe(0);
    });

    test('should identify already unlocked courses and disallow redundant unlocking', () => {
      mockUser.unlockedCourses.push('course_ai_99');
      const eligibility = canUnlockCourse(mockUser, premiumCourse);
      expect(eligibility.canUnlock).toBe(false);
      expect(eligibility.isAlreadyUnlocked).toBe(true);
      expect(eligibility.reason).toContain('already unlocked');
    });
  });

  describe('2. Course Unlock Execution (unlockCourse)', () => {
    test('should successfully unlock premium course and deduct correct tokens', () => {
      const result = unlockCourse(mockUser, premiumCourse);

      expect(result.success).toBe(true);
      expect(result.tokensDeducted).toBe(40);
      expect(result.remainingTokens).toBe(20); // 60 - 40
      expect(mockUser.tokens).toBe(20);
      expect(mockUser.unlockedCourses).toContain('course_ai_99');
      expect(result.message).toContain('Course unlocked successfully');
    });

    test('should prevent unlocking when user tokens are insufficient and not deduct tokens', () => {
      mockUser.tokens = 30; // 30 < 40
      const result = unlockCourse(mockUser, premiumCourse);

      expect(result.success).toBe(false);
      expect(result.remainingTokens).toBe(30);
      expect(result.shortfall).toBe(10);
      expect(mockUser.tokens).toBe(30);
      expect(mockUser.unlockedCourses).not.toContain('course_ai_99');
      expect(result.message).toContain('Insufficient tokens');
    });

    test('should unlock free course without deducting tokens', () => {
      const initialTokens = mockUser.tokens;
      const result = unlockCourse(mockUser, freeCourse);

      expect(result.success).toBe(true);
      expect(result.tokensDeducted).toBe(0);
      expect(result.remainingTokens).toBe(initialTokens);
      expect(mockUser.tokens).toBe(initialTokens);
      expect(mockUser.unlockedCourses).toContain('course_web_01');
    });

    test('should not double-charge or duplicate course in unlockedCourses if attempted again', () => {
      unlockCourse(mockUser, premiumCourse); // First unlock: 60 - 40 = 20
      expect(mockUser.tokens).toBe(20);

      // Attempt second unlock of the same course
      const secondAttempt = unlockCourse(mockUser, premiumCourse);
      expect(secondAttempt.success).toBe(false);
      expect(secondAttempt.alreadyUnlocked).toBe(true);
      expect(mockUser.tokens).toBe(20); // Not deducted again
      expect(mockUser.unlockedCourses.filter((id) => id === 'course_ai_99')).toHaveLength(1);
    });
  });
});
