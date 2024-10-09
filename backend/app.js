const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// MongoDB connection
const client = new MongoClient('mongodb+srv://mondalrishob:7s5FENjR6L7TQxfa@cluster0.9dq8n.mongodb.net/myntra');
let db;

client.connect()
  .then(() => {
    db = client.db('myntra');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// GET /items
app.get('/items', async (req, res) => {
  try {
    const storedItems = await db.collection('items').find().toArray();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    res.json({ items: storedItems });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving items' });
  }
});

// GET /items/:id
app.get('/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await db.collection('items').findOne({ id: itemId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving item' });
  }
});

// POST /items
app.post('/items', async (req, res) => {
  try {
    const itemData = req.body;
    const newItem = {
      ...itemData,
      id: Math.random().toString(),
    };
    await db.collection('items').insertOne(newItem);
    res.status(201).json({ message: 'Stored new item.', item: newItem });
  } catch (err) {
    res.status(500).json({ message: 'Error storing item' });
  }
});

// Start server
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});