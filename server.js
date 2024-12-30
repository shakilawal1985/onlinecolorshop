const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const dbUrl = 'mongodb://db:27017'; // Assuming the database is named "onlinecolorshop" in Docker

app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json());

let db;
MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('onlinecolorshop');
  })
  .catch(err => console.error("Database connection failed:", err));

app.get("/:color", (req, res) => {
  const color = req.params.color;
  res.sendFile(path.join(__dirname, 'app', `${color}.html`));
  updateUserCount(color);
});

app.get('/api/user-count', (req, res) => {
  const color = req.query.color;
  const collection = db.collection('userCounts');
  collection.findOne({ color }, (err, result) => {
    if (err) return res.status(500).send('Error fetching user count');
    res.json(result);
  });
});

function updateUserCount(color) {
  const collection = db.collection('userCounts');
  collection.updateOne(
    { color },
    { $inc: { count: 1 } },
    { upsert: true },
    (err, result) => {
      if (err) console.error("Error updating user count:", err);
    }
  );
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
