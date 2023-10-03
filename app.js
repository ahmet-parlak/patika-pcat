const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const PageController = require('./controllers/PageController');
const PhotoController = require('./controllers/PhotoController');

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
app.get('/', PageController.indexPage);
app.get('/about', PageController.aboutPage);
app.get('/add', PageController.addPage);

app.post('/photos', PhotoController.createPhoto);
app.get('/photos/:id', PhotoController.showPhoto);
app.get('/photos/:id/edit', PhotoController.editPhotoPage);
app.put('/photos/:id', PhotoController.updatePhoto);
app.delete('/photos/:id', PhotoController.deletePhoto);

app.get('*', PageController.notFoundPage);

//LISTEN
const port = 3000;
app.listen(port, () => {
  console.log(`The server has started running on port ${port}..`);
});
