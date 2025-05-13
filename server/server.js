const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const PORT = 5000;

const app = express();
dotenv.config();

app.get('/',(req,res)=>{
    res.send("Welcome to the server.")
})

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})