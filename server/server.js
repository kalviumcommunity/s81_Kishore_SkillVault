const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Course = require('./models/courses');
const User = require('./models/user');
const { validateRegistrationInput, validateLoginInput, authenticateUser } = require('./services/authValidationService');
const { completeTask } = require('./services/taskService');
const { unlockCourse } = require('./services/courseUnlockService');
const { getUserTokenBalance } = require('./services/tokenService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base health check
app.get('/', (req, res) => {
  res.send('Welcome to the server.');
});

// Course management routes
app.post('/add', async (req, res) => {
  const { title, description, imageUrl, difficulty, category, content, tokens, path, duration } = req.body;

  const newCourse = new Course({
    title,
    description,
    imageUrl,
    difficulty,
    category,
    content,
    tokens,
    path: path || `/courses/${title ? title.toLowerCase().replace(/\s+/g, '-') : Date.now()}`,
    duration: duration || '4 weeks',
  });

  try {
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/course', async (req, res) => {
  try {
    const data = await Course.find();
    res.send(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, difficulty, category, content, tokens } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        imageUrl,
        difficulty,
        category,
        content,
        tokens,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  const validation = validateRegistrationInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      tokens: 50,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: { id: newUser._id, name: newUser.name, email: newUser.email, tokens: newUser.tokens },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const validation = validateLoginInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    const authResult = authenticateUser(req.body, user);
    return res.status(authResult.status).json(authResult);
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Task submission route
app.post('/api/tasks/submit', async (req, res) => {
  const { user, task, submission } = req.body;
  const result = completeTask(user, task, submission);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.status(200).json(result);
});

// Course unlock route
app.post('/api/courses/unlock', async (req, res) => {
  const { user, course } = req.body;
  const result = unlockCourse(user, course);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.status(200).json(result);
});

// Token balance route
app.get('/api/users/:id/tokens', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ tokens: getUserTokenBalance(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  if (process.env.mongo_url) {
    mongoose
      .connect(process.env.mongo_url)
      .then(() => {
        console.log('mongo is connected');
      })
      .catch((err) => {
        console.error('mongodb connection is failed:', err.message);
      });
  }
}

module.exports = app;