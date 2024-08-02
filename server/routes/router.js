const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const User = require('../models/User');
const Item = require('../models/Item');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Log user in
// Register user
// Log out user

// Get data or user
// Get items data
// Get item data

// Add item to user cart
// Add item to liked 

/////////////////////////////////////////////

// Remove item from user cart
// Get cart data for user


// Add deliveries of user with status (preparing, on it's way, ready to pickup, done, error)
// Change delivery status

// Add search feature


// Middleware to authenticate JWT






router.get('/get-data', async (req, res) => {
  
  const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    

  try {
    const decoded = jwt.verify(token, 'testing');
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get('/get-item-data/:itemId', async (req, res) => {
  
  try {
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ data: item });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/get-random-items-data', async (req, res) => {
  try {
    const randomItems = await Item.aggregate([{ $sample: { size: 100 } }]);
    res.json(randomItems);
  } catch (error) {
    console.error('Error retrieving random items:', error);
    res.status(500).send('Internal Server Error');
  }
});




// Register
router.post('/register', async (req, res) => {
  
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  });


  // Logout
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});


  // Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
  
      const token = jwt.sign({ userId: user._id }, "testing", { expiresIn: '1h' });
      res.cookie('jwt', token, { httpOnly: true });
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  });





  router.post('/toggle-like/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const token = req.cookies.jwt;

   
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  

    try {
      const decoded = jwt.verify(token, 'testing');
      const userId = decoded.userId;
      

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Check if item is already liked
      const alreadyLiked = user.liked.includes(itemId);

      if (alreadyLiked) {
          // Remove from liked items
          user.likedItems = user.liked.filter(item => item !== itemId);
      } else {
          // Add to liked items
          user.liked.push(itemId);
      }

      await user.save();

      res.json({ data: user.likedItems });
  } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/add-to-cart', async (req, res) => {
  const { itemId, numberOfItems, itemDescription, itemName, price, image } = req.body;
  const token = req.cookies.jwt;

   
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }


  try {
    const decoded = jwt.verify(token, 'testing');
    const userId = decoded.userId;
    
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if item is already in cart
    const cartItemIndex = user.cart.findIndex(item => item.itemId === itemId);

    if (cartItemIndex > -1) {
        // Update the number of items if item already in cart
        const newItemsNumber = user.cart[cartItemIndex].numberOfItems + numberOfItems;
        user.cart[cartItemIndex] = { itemId, itemName, itemDescription, numberOfItems: newItemsNumber, price }; 
    } else {
        // Add new item to cart
        user.cart.push({
            itemId,
            itemName, 
            itemDescription,
            numberOfItems,
            price, 
            image,
        });
    }

    await user.save();
    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/remove-from-cart', async (req, res) => {
  const token = req.cookies.jwt;
   
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    
      const { itemId } = req.body;
      const decoded = jwt.verify(token, 'testing');
      const userId = decoded.userId;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.cart = user.cart.filter(item => item.itemId.toString() !== itemId);
      await user.save();

      res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});



 


  module.exports = router;