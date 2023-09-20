const express = require('express');

const mongoose = require('mongoose');

const ejs = require('ejs');

const path = require('path');

const Photo = require('./models/Photo');

//App
const app = express();

//DB Conntection
mongoose
  .connect('mongodb://localhost:27017/pcat-test-db')
  .then(() => console.log('DB Connected'));

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index', { photos });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  res.redirect('/');
});
app.get('*', (req, res) => {
  res.render('404');
});

const port = 3000;
app.listen(port, () => {
  console.log(`The server has started running on port ${port}..`);
});
