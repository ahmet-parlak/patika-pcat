const fs = require('fs');
const path = require('path');

const Photo = require('../models/Photo');

const rootDir = path.dirname(require.main.filename);

exports.createPhoto = async (req, res) => {
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
  const path = rootDir + '/public/uploads/' + imageName;
  image.mv(path, async (err) => {
    if (err) {
      return res.status(500).send('image failed to upload.');
    }
    await Photo.create({ ...req.body, image: '/uploads/' + imageName });
    res.redirect('/');
  });
};

exports.showPhoto = async (req, res) => {
  await Photo.findById(req.params.id)
    .then((photo) => {
      res.render('photo', { photo });
    })
    .catch(() => {
      res.render('404');
    });
};

exports.editPhotoPage = async (req, res) => {
  await Photo.findById(req.params.id)
    .then((photo) => {
      res.render('edit', { photo });
    })
    .catch(() => {
      res.render('404');
    });
};

exports.updatePhoto = async (req, res) => {
  await Photo.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect(`/photos/${req.params.id}`);
    })
    .catch(() => {
      res.render('404');
    });
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id, req.body).catch(() => {
    res.render('404');
  });
  if (fs.existsSync(rootDir + '/public' + photo.image)) {
    fs.unlinkSync(rootDir + '/public' + photo.image);
  }

  await Photo.deleteOne({ _id: req.params.id });

  res.redirect('/');
};
