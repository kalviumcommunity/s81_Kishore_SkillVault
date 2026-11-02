/**
 * SkillVault User Authentication & Validation Service
 * Validates registration and login inputs, email formats, password rules,
 * and user credential verification.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates user registration payload.
 * @param {Object} input - { name, email, password }
 * @returns {Object} { isValid: boolean, errors: Array<string> }
 */
function validateRegistrationInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object') {
    return { isValid: false, errors: ['Registration payload is required.'] };
  }

  const { name, email, password } = input;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Full name is required.');
  } else if (name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long.');
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email address is required.');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('Invalid email address format.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates user login payload.
 * @param {Object} input - { email, password }
 * @returns {Object} { isValid: boolean, errors: Array<string> }
 */
function validateLoginInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object') {
    return { isValid: false, errors: ['Login payload is required.'] };
  }

  const { email, password } = input;

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email address is required.');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('Invalid email address format.');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Authenticates user credentials against existing user record.
 * @param {Object} credentials - { email, password }
 * @param {Object} userRecord - Existing user document from database
 * @param {Function} passwordMatcher - Optional comparison function (defaults to strict equality for unhashed mocks)
 * @returns {Object} Authentication result
 */
function authenticateUser(credentials, userRecord, passwordMatcher = null) {
  const validation = validateLoginInput(credentials);
  if (!validation.isValid) {
    return {
      authenticated: false,
      status: 400,
      errors: validation.errors,
      message: `Validation failed: ${validation.errors.join(', ')}`,
    };
  }

  if (!userRecord) {
    return {
      authenticated: false,
      status: 401,
      errors: ['Invalid email or password.'],
      message: 'Invalid email or password.',
    };
  }

  const matches = passwordMatcher
    ? passwordMatcher(credentials.password, userRecord.password)
    : credentials.password === userRecord.password;

  if (!matches) {
    return {
      authenticated: false,
      status: 401,
      errors: ['Invalid email or password.'],
      message: 'Invalid email or password.',
    };
  }

  return {
    authenticated: true,
    status: 200,
    user: {
      id: userRecord._id || userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      tokens: typeof userRecord.tokens === 'number' ? userRecord.tokens : 50,
      unlockedCourses: userRecord.unlockedCourses || [],
    },
    message: 'Authentication successful.',
  };
}

module.exports = {
  EMAIL_REGEX,
  validateRegistrationInput,
  validateLoginInput,
  authenticateUser,
};
