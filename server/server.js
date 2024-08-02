const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes/router');
const cors = require('cors');
const cookieParser = require('cookie-parser');



const connectDB = async () => {
  try {
      const dbURI = process.env.MONGO_DB;
      await mongoose.connect(dbURI);
      console.log('Connected to MongoDB');
  } catch (err) {
      console.error('Error connecting to MongoDB', err);
      process.exit(1);
  }
};

// Create a new Express application
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // replace with your client's URL
  credentials: true
}));

app.use('/api', routes);

// Connect to MongoDB using Mongoose
connectDB().then(() => {
  app.listen(port, () => {
      console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

