const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['text', 'code', 'quiz'], required: true },
  points: { type: Number, default: 10 },
  resourceLinks: [String],
  answerKey: String, // for validation (quizzes or code)
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tasks: [taskSchema], // array of tasks per module
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true }, // e.g., Web Dev, Soft Skills
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  isPremium: { type: Boolean, default: false },
  tokenCost: { type: Number, default: 0 }, // if premium
  modules: [moduleSchema], // structured course content
  thumbnail: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
