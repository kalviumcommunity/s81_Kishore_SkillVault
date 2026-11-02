const Course = require('./courses');

describe('SkillVault - Course Model Schema Validation Tests', () => {
  test('should validate a valid course document', async () => {
    const validData = {
      title: 'Full Stack Web Development',
      category: 'Full Stack Development',
      description: 'Master React, Node.js, and MongoDB.',
      tokens: 30,
      path: '/courses/full-stack-web-dev',
      duration: '8 weeks',
    };

    const course = new Course(validData);
    const err = course.validateSync();
    expect(err).toBeUndefined();
    expect(course.title).toBe(validData.title);
    expect(course.category).toBe(validData.category);
    expect(course.tokens).toBe(validData.tokens);
  });

  test('should require mandatory fields: title, category, description, tokens, path, duration', () => {
    const incompleteCourse = new Course({});
    const err = incompleteCourse.validateSync();

    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.description).toBeDefined();
    expect(err.errors.tokens).toBeDefined();
    expect(err.errors.path).toBeDefined();
    expect(err.errors.duration).toBeDefined();
  });

  test('should enforce category enum constraints', () => {
    const invalidCategoryCourse = new Course({
      title: 'Quantum Physics',
      category: 'Astronomy', // not in allowed enum
      description: 'Physics course',
      tokens: 20,
      path: '/courses/physics',
      duration: '4 weeks',
    });

    const err = invalidCategoryCourse.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.category.message).toContain('`Astronomy` is not a valid enum value');
  });
});