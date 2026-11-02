/**
 * SkillVault Token Reward System Service
 * Handles token calculations, rewards upon task completion,
 * token balance tracking, and deductions for course unlocking.
 */

/**
 * Calculates tokens to award based on task specification and submission quality.
 * @param {Object} task - Task object with points and optional difficulty
 * @param {Object} submissionResult - Evaluation result { isValid, score, passed }
 * @returns {number} Tokens to award (0 if submission invalid or failed)
 */
function calculateTokensForTask(task, submissionResult) {
  if (!task || !task.points || task.points <= 0) {
    return 0;
  }

  if (!submissionResult || !submissionResult.isValid || submissionResult.passed === false) {
    return 0;
  }

  // Base points from task definition
  let tokens = task.points;

  // Bonus for perfect quiz scores (100%)
  if (task.type === 'quiz' && submissionResult.score === 100) {
    tokens += Math.round(task.points * 0.2); // 20% bonus
  }

  return tokens;
}

/**
 * Awards tokens to a user upon verified task completion.
 * @param {Object} user - User object { tokens, completedTasks }
 * @param {number} amount - Number of tokens to award
 * @param {Object} taskDetails - { taskId, courseId, title }
 * @returns {Object} Updated user summary { tokens, tokensAwarded, success }
 */
function awardTokensToUser(user, amount, taskDetails = {}) {
  if (!user) {
    throw new Error('User is required to award tokens');
  }

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return {
      success: false,
      tokensAwarded: 0,
      currentBalance: user.tokens || 0,
      message: 'Invalid token amount. Tokens awarded must be a positive number.',
    };
  }

  // Ensure user has numeric tokens
  user.tokens = (typeof user.tokens === 'number' && !isNaN(user.tokens)) ? user.tokens : 0;
  user.tokens += amount;

  // Record completed task history if provided
  if (!Array.isArray(user.completedTasks)) {
    user.completedTasks = [];
  }

  if (taskDetails && taskDetails.taskId) {
    user.completedTasks.push({
      taskId: taskDetails.taskId,
      courseId: taskDetails.courseId || null,
      tokensEarned: amount,
      completedAt: new Date(),
    });
  }

  return {
    success: true,
    tokensAwarded: amount,
    currentBalance: user.tokens,
    message: `Successfully awarded ${amount} tokens.`,
  };
}

/**
 * Deducts tokens from a user (e.g., when redeeming to unlock a course).
 * @param {Object} user - User object { tokens }
 * @param {number} amount - Number of tokens to deduct
 * @param {string} reason - Reason for deduction
 * @returns {Object} { success, deducted, remainingBalance, message }
 */
function deductTokensFromUser(user, amount, reason = 'course_unlock') {
  if (!user) {
    throw new Error('User is required to deduct tokens');
  }

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return {
      success: false,
      remainingBalance: user.tokens || 0,
      message: 'Deduction amount must be a positive number.',
    };
  }

  const currentBalance = typeof user.tokens === 'number' ? user.tokens : 0;

  if (currentBalance < amount) {
    return {
      success: false,
      remainingBalance: currentBalance,
      shortfall: amount - currentBalance,
      message: `Insufficient tokens. You have ${currentBalance} tokens, but ${amount} are required.`,
    };
  }

  user.tokens = currentBalance - amount;

  return {
    success: true,
    deducted: amount,
    remainingBalance: user.tokens,
    reason,
    message: `Successfully deducted ${amount} tokens.`,
  };
}

/**
 * Retrieves the current token balance for a user.
 * @param {Object} user
 * @returns {number}
 */
function getUserTokenBalance(user) {
  if (!user) return 0;
  return typeof user.tokens === 'number' && !isNaN(user.tokens) ? user.tokens : 0;
}

module.exports = {
  calculateTokensForTask,
  awardTokensToUser,
  deductTokensFromUser,
  getUserTokenBalance,
};
