const {
  validateRegistrationInput,
  validateLoginInput,
  authenticateUser,
} = require('../services/authValidationService');

describe('SkillVault - User Authentication & Input Validation Unit Tests', () => {
  describe('1. Registration Input Validation', () => {
    test('should validate correct registration payload', () => {
      const validPayload = {
        name: 'Kishore Varma',
        email: 'kishore@example.com',
        password: 'securePassword123',
      };

      const result = validateRegistrationInput(validPayload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject registration when required fields are missing', () => {
      const emptyPayload = {};
      const result = validateRegistrationInput(emptyPayload);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Full name is required.');
      expect(result.errors).toContain('Email address is required.');
      expect(result.errors).toContain('Password is required.');
    });

    test('should reject registration with invalid email formats', () => {
      const invalidEmails = ['plainaddress', '@missingusername.com', 'user@domain', 'user@.com'];

      invalidEmails.forEach((email) => {
        const result = validateRegistrationInput({
          name: 'Valid Name',
          email,
          password: 'validPassword123',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid email address format.');
      });
    });

    test('should reject registration when password length is less than 6 characters', () => {
      const shortPasswordPayload = {
        name: 'Valid Name',
        email: 'user@example.com',
        password: '123',
      };

      const result = validateRegistrationInput(shortPasswordPayload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters long.');
    });
  });

  describe('2. Login Input Validation', () => {
    test('should validate valid login payload', () => {
      const validLogin = {
        email: 'student@skillvault.edu',
        password: 'vaultPassword',
      };

      const result = validateLoginInput(validLogin);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject login with missing email or password', () => {
      const missingPassword = { email: 'student@skillvault.edu' };
      const missingEmail = { password: 'secret' };

      const res1 = validateLoginInput(missingPassword);
      expect(res1.isValid).toBe(false);
      expect(res1.errors).toContain('Password is required.');

      const res2 = validateLoginInput(missingEmail);
      expect(res2.isValid).toBe(false);
      expect(res2.errors).toContain('Email address is required.');
    });

    test('should reject login with invalid email syntax', () => {
      const badEmailLogin = {
        email: 'notanemail',
        password: 'validpassword',
      };

      const result = validateLoginInput(badEmailLogin);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email address format.');
    });
  });

  describe('3. Credential Verification & Authentication', () => {
    const mockUserRecord = {
      _id: 'usr_abc_789',
      name: 'Kishore Varma',
      email: 'kishore@skillvault.com',
      password: 'hashedPassword_123',
      tokens: 75,
      unlockedCourses: ['course_01'],
    };

    test('should successfully authenticate user with matching credentials', () => {
      const credentials = {
        email: 'kishore@skillvault.com',
        password: 'plain_password',
      };

      // Mock password comparison (e.g. bcrypt.compare)
      const mockPasswordMatcher = jest.fn().mockReturnValue(true);

      const result = authenticateUser(credentials, mockUserRecord, mockPasswordMatcher);

      expect(result.authenticated).toBe(true);
      expect(result.status).toBe(200);
      expect(result.user).toBeDefined();
      expect(result.user.name).toBe('Kishore Varma');
      expect(result.user.tokens).toBe(75);
      expect(result.user.password).toBeUndefined(); // ensure password is not exposed
      expect(mockPasswordMatcher).toHaveBeenCalledWith('plain_password', 'hashedPassword_123');
    });

    test('should reject authentication when password does not match', () => {
      const credentials = {
        email: 'kishore@skillvault.com',
        password: 'wrong_password',
      };

      const mockPasswordMatcher = jest.fn().mockReturnValue(false);

      const result = authenticateUser(credentials, mockUserRecord, mockPasswordMatcher);

      expect(result.authenticated).toBe(false);
      expect(result.status).toBe(401);
      expect(result.message).toBe('Invalid email or password.');
      expect(result.user).toBeUndefined();
    });

    test('should reject authentication when user record is null (user not found)', () => {
      const credentials = {
        email: 'nonexistent@skillvault.com',
        password: 'any_password',
      };

      const result = authenticateUser(credentials, null);

      expect(result.authenticated).toBe(false);
      expect(result.status).toBe(401);
      expect(result.message).toBe('Invalid email or password.');
    });
  });
});
