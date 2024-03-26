// just inside the project server.jsCreate an instance of Express


const express = require('express');
 
const router = express.Router();

const mongoose = require('mongoose');
const Product = require('./models/product');
const Advertisement = require('./models/advertisement');
const Order = require('./models/order'); // Make sure the path is correct
const User = require('./models/User');
const nodemailer = require('nodemailer');
const session = require('express-session');


 
const multer = require('multer');
const path = require('path');

 

// Create an instance of Express
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://juma:juma@cluster0.tvrxlqa.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

 
// Assuming you have an Express route to render the admin dashboard
app.get('/view/admin_dashboard', async (req, res) => {
  try {
    // Retrieve necessary data from the database
    let products = await Product.find();
    let orders = await Order.find();
    let advertisements = await Advertisement.find();
    let users = await User.find();

    // Filter products by category if category parameter is provided in the query
    const category = req.query.category;
    if (category) {
      products = await Product.find({ category });
    }

    // Search products by name if search query parameter is provided
    const searchQuery = req.query.search;
    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'i');
      products = await Product.find({ productName: regex });
    }

    // Organize products by category
    const categories = await Product.distinct('category');

    // Render the admin dashboard EJS file and pass the data as variables
    res.render('admin_dashboard', { 
      products, 
      orders, 
      advertisements, 
      users, 
      categories,
      selectedCategory: category,
      searchQuery
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/view/form', (req, res) => {
  res.render('form'); // Assuming your EJS file is named form.ejs
});
 



app.get('/orderform/:productId', (req, res) => {
  const productId = req.params.productId;
  // Render the order form page with the productId value
  res.render('orderform', { productId });
});


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: './public/images/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Serve static files
app.use(express.static('public'));

// Handle form submissions to add products



app.post('/addProduct', upload.array('productImages', 3), async (req, res) => {
  try {
    const { productName, description, price, category } = req.body;
    const productImages = req.files.map(file => file.filename);

    if (productImages.length !== 3) {
      return res.status(400).send('Please upload exactly 3 images.');
    }

    const newProduct = new Product({
      productName,
      description,
      price,
      category,
      productImages,
    });

    await newProduct.save();
    res.redirect(`/category/${category}`);
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Display products on the home page
// Display products on the home page
// Fetches the top 10 products for the specified category
app.get('/category/:category', async (req, res) => {
  const category = req.params.category;

  try {
    const products = await Product.find({ category }).sort({ createdAt: -1 }).limit(10);
    const formattedProducts = products.map(product => ({
      _id: product._id, // Include the product ID
      productName: product.productName,
      description: product.description,
      price: product.price,
      productImages: product.productImages
    }));
    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetches the top 10 products for each category with product IDs
app.post('/addProduct', upload.array('productImages', 3), async (req, res) => {
  try {
    const { productName, description, price, category } = req.body;
    const productImages = req.files.map(file => file.filename);

    if (productImages.length !== 3) {
      return res.status(400).send('Please upload exactly 3 images if pc press ctrl the select image if phone keep press one image then select.');
    }

    const newProduct = new Product({
      productName,
      description,
      price,
      category,
      productImages,
    });

    await newProduct.save();
    res.redirect(`/category/${category}`);
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).send('Internal Server Error');
  }
});

 


















app.get('/orderform/:productId', (req, res) => {
  const productId = req.params.productId;
  res.render('orderform', { productId });
});

// Add Product Route
app.post('/addProduct', upload.array('productImages', 3), async (req, res) => {
  try {
    const { productName, description, price, category } = req.body;
    const productImages = req.files.map(file => file.filename);

    if (productImages.length !== 3) {
      return res.status(400).send('Please upload exactly 3 images.');
    }

    const newProduct = new Product({
      productName,
      description,
      price,
      category,
      productImages,
    });

    await newProduct.save();
    res.redirect(`/category/${category}`);
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add to Cart Route
app.post('/addToCart', (req, res) => {
  // Handle adding items to the cart here
});

// Cart Route
app.get('/cart', (req, res) => {
  // Retrieve cart data from session and render the cart page
});

// Remove from Cart Route
app.post('/removeFromCart', (req, res) => {
  // Handle removing items from the cart here
});

// Display Products by Category Route
app.get('/category/:category', async (req, res) => {
  const category = req.params.category;

  try {
    const products = await Product.find({ category }).sort({ createdAt: -1 }).limit(10);
    const formattedProducts = products.map(product => ({
      _id: product._id,
      productName: product.productName,
      description: product.description,
      price: product.price,
      productImages: product.productImages
    }));
    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Email Sending Route
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'enricnakon@gmail.com', // your gmail account
      pass: 'put app generated pass', // your gmail password
  }
});

app.post('/order', (req, res) => {
  const { imageUrl, title, description, price, email } = req.body;

  let mailOptions = {
      from: 'enricnakon@gmail.com',
      to: 'enricnakon@gmail.com', // recipient email
      subject: 'New Order',
      html: `
          <h3>New Order Details</h3>
          <p><strong>Item:</strong> ${title}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Email:</strong> ${email}</p>
          <img src="${imageUrl}" alt="Item Image" style="max-width: 200px; height: auto;">
      `
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
          res.status(500).send('Error sending order');
      } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send('Order sent successfully');
      }
  });
});































app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});