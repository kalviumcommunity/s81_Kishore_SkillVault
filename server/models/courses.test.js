const courses = require('./courses');

test('should create a course', () => {
	const courseData = { title: 'New Course', description: 'Course Description' };
	const course = courses.create(courseData);
	expect(course).toHaveProperty('id');
	expect(course.title).toBe(courseData.title);
	expect(course.description).toBe(courseData.description);
});

test('should retrieve a course by id', () => {
	const courseData = { title: 'Existing Course', description: 'Course Description' };
	const course = courses.create(courseData);
	const retrievedCourse = courses.getById(course.id);
	expect(retrievedCourse).toEqual(course);
});

test('should update a course', () => {
	const courseData = { title: 'Old Course', description: 'Old Description' };
	const course = courses.create(courseData);
	const updatedData = { title: 'Updated Course', description: 'Updated Description' };
	const updatedCourse = courses.update(course.id, updatedData);
	expect(updatedCourse.title).toBe(updatedData.title);
	expect(updatedCourse.description).toBe(updatedData.description);
});

test('should delete a course', () => {
	const courseData = { title: 'Course to Delete', description: 'Delete Description' };
	const course = courses.create(courseData);
	courses.delete(course.id);
	const deletedCourse = courses.getById(course.id);
	expect(deletedCourse).toBeUndefined();
});