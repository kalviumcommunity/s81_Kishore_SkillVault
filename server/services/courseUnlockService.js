/**
 * SkillVault Course Unlocking Service
 * Handles course access checks, verifying user token balance,
 * deducting tokens for premium courses, and updating user unlocked courses.
 */

const { deductTokensFromUser } = require('./tokenService');

/**
 * Checks if a user is eligible to unlock a course.
 * @param {Object} user - User object { tokens, unlockedCourses }
 * @param {Object} course - Course object { _id, id, isPremium, tokenCost, tokens }
 * @returns {Object} { canUnlock: boolean, reason: string, requiredTokens: number }
 */
function canUnlockCourse(user, course) {
  if (!user) {
    return { canUnlock: false, reason: 'User not found.', requiredTokens: 0 };
  }

  if (!course) {
    return { canUnlock: false, reason: 'Course not found.', requiredTokens: 0 };
  }

  const courseId = (course._id || course.id || '').toString();
  const unlocked = Array.isArray(user.unlockedCourses)
    ? user.unlockedCourses.map((id) => (id._id || id.id || id).toString())
    : [];

  // Check if course is already unlocked
  if (courseId && unlocked.includes(courseId)) {
    return { canUnlock: false, isAlreadyUnlocked: true, reason: 'Course is already unlocked.', requiredTokens: 0 };
  }

  // Cost can be specified by tokenCost or tokens property (from courses model)
  const cost = typeof course.tokenCost === 'number' ? course.tokenCost : (typeof course.tokens === 'number' ? course.tokens : 0);
  const isPremium = course.isPremium !== undefined ? course.isPremium : cost > 0;

  // Free courses can always be unlocked
  if (!isPremium || cost <= 0) {
    return { canUnlock: true, reason: 'Course is free.', requiredTokens: 0 };
  }

  const userTokens = typeof user.tokens === 'number' ? user.tokens : 0;

  if (userTokens >= cost) {
    return { canUnlock: true, reason: 'Sufficient tokens available.', requiredTokens: cost };
  }

  return {
    canUnlock: false,
    reason: `Insufficient tokens. Required: ${cost}, available: ${userTokens}.`,
    requiredTokens: cost,
    shortfall: cost - userTokens,
  };
}

/**
 * Unlocks a course for a user, deducting tokens if the course is premium.
 * @param {Object} user - User object { tokens, unlockedCourses }
 * @param {Object} course - Course object { _id, id, title, tokenCost, tokens, isPremium }
 * @returns {Object} { success: boolean, message: string, remainingTokens: number, courseId: string }
 */
function unlockCourse(user, course) {
  const eligibility = canUnlockCourse(user, course);

  if (!eligibility.canUnlock) {
    return {
      success: false,
      message: eligibility.reason,
      alreadyUnlocked: Boolean(eligibility.isAlreadyUnlocked),
      remainingTokens: user ? user.tokens : 0,
      shortfall: eligibility.shortfall || 0,
    };
  }

  const cost = eligibility.requiredTokens;

  // Deduct tokens if premium
  if (cost > 0) {
    const deduction = deductTokensFromUser(user, cost, `unlock_course_${course._id || course.id || course.title}`);
    if (!deduction.success) {
      return {
        success: false,
        message: deduction.message,
        remainingTokens: user.tokens,
      };
    }
  }

  // Add course to user's unlocked list
  if (!Array.isArray(user.unlockedCourses)) {
    user.unlockedCourses = [];
  }

  const courseId = course._id || course.id || course.title;
  user.unlockedCourses.push(courseId);

  return {
    success: true,
    message: cost > 0
      ? `Course unlocked successfully! Deducted ${cost} tokens.`
      : 'Free course unlocked successfully!',
    remainingTokens: user.tokens,
    courseId,
    courseTitle: course.title,
    tokensDeducted: cost,
  };
}

module.exports = {
  canUnlockCourse,
  unlockCourse,
};
