/**
 * SkillVault Task Completion Service
 * Validates task submissions, evaluates text, code, or quiz tasks,
 * and handles completion and token awards.
 */

const { calculateTokensForTask, awardTokensToUser } = require('./tokenService');
const { evaluateQuiz } = require('./quizService');

/**
 * Validates a task submission according to task type and rules.
 * @param {Object} task - Task definition { id, type, points, questions }
 * @param {Object} submission - Submission { userId, content, code, answers }
 * @returns {Object} { isValid: boolean, errors: Array<string> }
 */
function validateTaskSubmission(task, submission) {
  const errors = [];

  if (!task) {
    errors.push('Task definition is required.');
    return { isValid: false, errors };
  }

  if (!submission) {
    errors.push('Submission payload is required.');
    return { isValid: false, errors };
  }

  if (!submission.userId) {
    errors.push('User ID is required for task submission.');
  }

  const taskType = task.type || 'text';

  switch (taskType) {
    case 'text': {
      if (!submission.content || typeof submission.content !== 'string' || submission.content.trim().length === 0) {
        errors.push('Text submission content cannot be empty.');
      } else if (submission.content.trim().length < 15) {
        errors.push('Text submission must be at least 15 characters long.');
      }
      break;
    }

    case 'code': {
      if (!submission.code || typeof submission.code !== 'string' || submission.code.trim().length === 0) {
        errors.push('Code submission cannot be empty.');
      } else if (submission.code.trim().length < 10) {
        errors.push('Code submission must be at least 10 characters long.');
      }
      break;
    }

    case 'quiz': {
      if (!submission.answers || typeof submission.answers !== 'object' || Object.keys(submission.answers).length === 0) {
        errors.push('Quiz submission must include answers.');
      }
      break;
    }

    default:
      errors.push(`Unsupported task type: ${taskType}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Processes task submission, evaluates completion, and awards tokens.
 * @param {Object} user - User object { tokens, completedTasks }
 * @param {Object} task - Task object { id, _id, title, type, points, questions, courseId }
 * @param {Object} submission - Submission data
 * @returns {Object} { success, taskStatus, tokensAwarded, newBalance, message }
 */
function completeTask(user, task, submission) {
  const validation = validateTaskSubmission(task, submission);

  if (!validation.isValid) {
    return {
      success: false,
      taskStatus: 'rejected',
      tokensAwarded: 0,
      newBalance: user ? user.tokens : 0,
      errors: validation.errors,
      message: `Task submission rejected: ${validation.errors.join(', ')}`,
    };
  }

  let evaluation = { isValid: true, passed: true, score: 100 };

  // If task is a quiz, evaluate answers
  if (task.type === 'quiz') {
    const questions = task.questions || [];
    evaluation = evaluateQuiz(questions, submission.answers);

    if (!evaluation.passed) {
      return {
        success: false,
        taskStatus: 'failed',
        score: evaluation.score,
        tokensAwarded: 0,
        newBalance: user ? user.tokens : 0,
        message: `Task failed: Quiz score was ${evaluation.score}%, below passing threshold.`,
      };
    }
  }

  // Calculate tokens to award
  const tokensToAward = calculateTokensForTask(task, evaluation);

  // Award tokens to user
  const taskId = task.id || task._id || task.title;
  const awardResult = awardTokensToUser(user, tokensToAward, {
    taskId,
    courseId: task.courseId,
    title: task.title,
  });

  return {
    success: true,
    taskStatus: 'completed',
    taskId,
    tokensAwarded: tokensToAward,
    newBalance: awardResult.currentBalance,
    score: evaluation.score,
    message: `Task completed successfully! You earned ${tokensToAward} tokens.`,
  };
}

module.exports = {
  validateTaskSubmission,
  completeTask,
};
