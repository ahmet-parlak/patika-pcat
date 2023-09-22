const Photo = require('../models/Photo');

exports.indexPage = async (req, res) => {
  const page = req.query.page ?? 1;
  const photosPerPage = 3;
  const totalPhotos = await Photo.find().countDocuments();
  const totalPages = Math.ceil(totalPhotos / photosPerPage);

  if (page > 1 && page > totalPages) res.render('404');

  const photos = await Photo.find()
    .sort('-createdDate')
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render('index', { photos, current: page, pages: totalPages });
};

exports.aboutPage = (req, res) => {
  res.render('about');
};

exports.addPage = (req, res) => {
  res.render('add');
};

exports.notFoundPage = (req, res) => {
  res.render('404');
};
