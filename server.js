const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Tworzenie tabeli sprzedaży
db.serialize(() => {
  db.run("CREATE TABLE sales (id INTEGER PRIMARY KEY, product_name TEXT, quantity INTEGER, price REAL)");
});

// Endpoint do zapisywania danych sprzedaży
app.post('/add-sale', (req, res) => {
  const { product_name, quantity, price } = req.body;
  db.run("INSERT INTO sales (product_name, quantity, price) VALUES (?, ?, ?)", [product_name, quantity, price], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.send('Dane sprzedaży zostały zapisane');
  });
});

// Endpoint do pobierania danych sprzedażowych
app.get('/sales', (req, res) => {
  db.all("SELECT * FROM sales", (err, rows) => {
    if (err) {
      return console.log(err.message);
    }
    res.json(rows);
  });
});

// Serwowanie pliku HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});