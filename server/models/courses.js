import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Full Stack Development',
      'Blockchain & Web3',
      'Data Structures & Algorithms',
      'Mobile Development',
      'AI & Machine Learning',
      'Cloud & DevOps',
      'Cybersecurity',
    ],
  },
  description: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  duration: {
    type: String,
    required: true,
  },
  
});

export default mongoose.model('Course', courseSchema);
