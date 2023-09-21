const Photo = require('../models/Photo');

exports.indexPage = async (req, res) => {
  const photos = await Photo.find({}).sort('-createdDate');
  res.render('index', { photos });
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
