const express = require('express');

const mongoose = require('mongoose');

const ejs = require('ejs');

const fileUpload = require('express-fileupload');

const methodOverride = require('method-override');

const path = require('path');

const fs = require('fs');

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
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['GET', 'POST'],
  })
);

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-createdDate');
  res.render('index', { photos });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const image = req.files.image;
  const imageName =
    (Math.random() + 1).toString(36).substring(7) + '_' + image.name;
  const path = __dirname + '/public/uploads/' + imageName;

  image.mv(path, async (err) => {
    if (err) {
      return res.status(500).send('image failed to upload.');
    }
    await Photo.create({ ...req.body, image: '/uploads/' + imageName });
    res.redirect('/');
  });
});

app.get('/photos/:id', async (req, res) => {
  await Photo.findById(req.params.id)
    .then((photo) => {
      res.render('photo', { photo });
    })
    .catch(() => {
      res.render('404');
    });
});
app.get('/photos/:id/edit', async (req, res) => {
  await Photo.findById(req.params.id)
    .then((photo) => {
      res.render('edit', { photo });
    })
    .catch(() => {
      res.render('404');
    });
});
app.put('/photos/:id', async (req, res) => {
  await Photo.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect(`/photos/${req.params.id}`);
    })
    .catch(() => {
      res.render('404');
    });
});
app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id, req.body).catch(() => {
    res.render('404');
  });
  if (fs.existsSync(__dirname + '/public' + photo.image)) {
    fs.unlinkSync(__dirname + '/public' + photo.image);
  }

  await Photo.deleteOne({ _id: req.params.id });

  res.redirect('/');
});

app.get('*', (req, res) => {
  res.render('404');
});

//LISTEN
const port = 3000;
app.listen(port, () => {
  console.log(`The server has started running on port ${port}..`);
});
