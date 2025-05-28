const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const PORT = 5000;
const Course= require('./models/courses');
const { default: courses } = require('./models/courses');


const app = express();
dotenv.config();

app.get('/',(req,res)=>{
    res.send("Welcome to the server.")
})
app.post('/add', async (req, res) => {
  const {  title, description, imageUrl, difficulty, category, content,tokens } = req.body;

  const newCourse = new Course({
      title,
      description,
      imageUrl,
      difficulty,
      category,
      content,
      tokens,
    });

  try {
      
  const savedCourse = await newCourse.save();
  res.status(201).json(savedCourse);
  }catch (error) {
      console.error('Error creating course:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
});

app.get('/course',async(req,res)=>{
    let data= await Course.find()
    res.send(data)
})
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)

})

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
  

mongoose.connect(process.env.mongo_url)
.then(()=>{
console.log("mongo is connected")
})
.catch(err=>{
    console.error("mongodb connection is failed:",err.message)
    process.exit(1);
})