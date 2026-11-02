/**
 * SkillVault Quiz Evaluation Service
 * Evaluates student answers against quiz questions and answer keys,
 * computes score percentage, and determines pass/fail status.
 */

/**
 * Evaluates a student's quiz answers against the answer key.
 * @param {Array<Object>} questions - List of questions [{ id, question, correctAnswer, points }]
 * @param {Object} userAnswers - Mapping of question id to user's answer { [id]: answer }
 * @param {number} passingPercentage - Threshold percentage to pass (default 70)
 * @returns {Object} Evaluation summary
 */
function evaluateQuiz(questions, userAnswers, passingPercentage = 70) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      isValid: false,
      score: 0,
      totalQuestions: 0,
      correctCount: 0,
      incorrectCount: 0,
      passed: false,
      message: 'Invalid quiz: questions array is required and cannot be empty.',
      questionResults: [],
    };
  }

  if (!userAnswers || typeof userAnswers !== 'object') {
    return {
      isValid: false,
      score: 0,
      totalQuestions: questions.length,
      correctCount: 0,
      incorrectCount: questions.length,
      passed: false,
      message: 'User answers object is missing or invalid.',
      questionResults: [],
    };
  }

  let correctCount = 0;
  const questionResults = [];

  questions.forEach((q, index) => {
    const qId = q.id !== undefined ? q.id : index;
    const submitted = userAnswers[qId] !== undefined ? userAnswers[qId] : userAnswers[String(qId)];
    const expected = q.correctAnswer !== undefined ? q.correctAnswer : q.answerKey;

    const normalizedSubmitted = submitted !== undefined && submitted !== null
      ? String(submitted).trim().toLowerCase()
      : null;
    const normalizedExpected = expected !== undefined && expected !== null
      ? String(expected).trim().toLowerCase()
      : null;

    const isCorrect = normalizedExpected !== null && normalizedSubmitted !== null && normalizedSubmitted === normalizedExpected;

    if (isCorrect) {
      correctCount += 1;
    }

    questionResults.push({
      questionId: qId,
      submittedAnswer: submitted,
      isCorrect,
    });
  });

  const totalQuestions = questions.length;
  const incorrectCount = totalQuestions - correctCount;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= passingPercentage;

  return {
    isValid: true,
    score,
    totalQuestions,
    correctCount,
    incorrectCount,
    passed,
    passingPercentage,
    questionResults,
    message: passed
      ? `Quiz passed with score ${score}%. (${correctCount}/${totalQuestions} correct)`
      : `Quiz failed with score ${score}%. Passing threshold is ${passingPercentage}%.`,
  };
}

module.exports = {
  evaluateQuiz,
};
