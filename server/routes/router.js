const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const User = require('../models/User');
const Item = require('../models/Item');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const CategoryMapping = require('../CategoryMapping');

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
  const category = (req.query.category == undefined || req.query.category == 'wszystkie_kategorie') ? null : req.query.category;
  
  
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
  const category = req.query.category && req.query.category !== 'wszystkie_kategorie' ? req.query.category : null;

  try {
    let items;
    
    if (category) {
      // Get items by category
      items = await Item.find({ category }).limit(100);
    } else {
      // Get random items
      items = await Item.aggregate([{ $sample: { size: 100 } }]);
    }

    // If fewer than 100 items are found, fill up with random items
    if (items.length < 100) {
      const additionalItems = await Item.aggregate([{ $sample: { size: 100 - items.length } }]);
      items = items.concat(additionalItems);
    }

    // Shuffle the items array to randomize the order
    items = items.sort(() => 0.5 - Math.random());

    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).send('Internal Server Error');
  }
});



const getRandomItems = async (limit = 100) => {
  return await Item.aggregate([{ $sample: { size: limit } }]);
};

// Utility function to get a minimum number of items
const getItemsWithMinimumCount = async (searchPattern, minCount) => {
  // Fetch items matching the search pattern
  const matchingItems = await Item.find({
    $or: [
      { name: { $regex: searchPattern } },
      { description: { $regex: searchPattern } }
    ]
  }).limit(minCount); // Ensure to fetch at least `minCount` items

  // If fewer items are found than required, fetch random items
  if (matchingItems.length < minCount) {
    const randomItems = await getRandomItems(minCount - matchingItems.length);
    return matchingItems.concat(randomItems); // Combine search results with random results
  }

  return matchingItems;
};

router.get('/get-specific-data/:parameter', async (req, res) => {
  let category = req.query.category && req.query.category !== 'wszystkie_kategorie' ? CategoryMapping[req.query.category.toLowerCase()] : null;
  const parameter = req.params.parameter;
  

  try {
    if (typeof parameter !== 'string' || parameter.trim() === '') {
      return res.status(400).json({ error: 'Invalid search text' });
    }

    const searchPattern = new RegExp(parameter, 'i');
    let items;

    if (category) {
      items = await Item.find({ category, $or: [{ name: searchPattern }, { description: searchPattern }] }).limit(100);
    } else {
      items = await Item.find({ $or: [{ name: searchPattern }, { description: searchPattern }] }).limit(100);
    }

    if (items.length < 100) {
      const additionalItems = await Item.aggregate([{ $sample: { size: 100 - items.length } }]);
      items = items.concat(additionalItems);
    }


   

    res.json(items);
  } catch (error) {
    console.error('Error retrieving specific items:', error);
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
      console.log(user.cart)
      await user.save();

      res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/update-cart-item', async (req, res) => {
  const token = req.cookies.jwt;
   
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    
      const { itemId, newQuantity } = req.body;
      const decoded = jwt.verify(token, 'testing');
      const userId = decoded.userId;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      let newCart = user.cart;
      const index = newCart.findIndex(item => item.itemId === itemId);
      newCart[index].numberOfItems = newQuantity;
      user.cart = newCart;

      await user.save();

      res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/bought-items', async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
      // Step 1: Find the user by email (assuming email is part of userData)
      const decoded = jwt.verify(token, 'testing');
      const userId = decoded.userId;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Get the cart items from the user data
      const cartItems = user.cart || [];
      

      // Step 2: Update the items in the inventory and clear the user's cart
      for (const cartItem of cartItems) {
          const item = await Item.findById(cartItem.itemId);
          if (!item) {
              continue; // Skip if the item does not exist
          }
          

          // Step 3: Update the item's quantity and boughtNumber
          if (item.quantityAvailable >= cartItem.numberOfItems) {
              item.quantityAvailable -= cartItem.numberOfItems;
              item.boughtNumber += cartItem.numberOfItems;

              await item.save();
          } else {
              return res.status(400).json({ message: `Not enough quantity for item: ${item.name}` });
          }
      }

      // Step 4: Clear the user's cart
      user.cart = []; // Clear the cart
      await user.save(); // Save the updated user document

      // Step 5: Send a response back to the client
      res.status(200).json({ message: 'Items purchased successfully!' });
  } catch (error) {
      console.error('Error processing purchase:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});




 


  module.exports = router;