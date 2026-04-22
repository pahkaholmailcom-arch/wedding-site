const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Статические файлы
app.use(express.static('public'));
app.use(bodyParser.json());

const DATA_FILE = 'guests.json';
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

// POST RSVP
app.post('/rsvp', (req, res) => {
  const { allNames, attendance, transfer, alcohol } = req.body;

  if (!allNames || !attendance) {
    return res.status(400).send('Заполните обязательные поля');
  }

  const guests = JSON.parse(fs.readFileSync(DATA_FILE));

  guests.push({
    allNames,
    attendance,
    transfer,
    alcohol,
    time: new Date().toLocaleString()
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(guests, null, 2));

  console.log(`Новый RSVP: ${allNames}`);
  res.send('Спасибо! Ваш ответ сохранён 💖');
});

// GET список гостей
app.get('/guests', (req, res) => {
  const guests = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(guests);
});

// POST очистка списка
app.post('/clear-guests', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  console.log('Список гостей очищен');
  res.send('Список гостей очищен');
});

// ЗАПУСК БЕЗ HOST
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});