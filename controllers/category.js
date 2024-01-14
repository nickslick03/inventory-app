const asyncHandler = require('express-async-handler');

module.exports.category = asyncHandler(async (req, res, next) => {
  res.redirect(req.baseUrl + '/all');
});

module.exports.get_category_all = asyncHandler(async (req, res) => {

  

  res.send('all categories');
});

module.exports.get_category = asyncHandler(async (req, res) => {
  res.send('view id ' + req.params.id);
});

module.exports.get_category_edit = asyncHandler(async (req, res) => {
  res.send('get edit id ' + req.params.id);
});

module.exports.post_category_edit = asyncHandler(async (req, res) => {
  res.send('post edit id ' + req.params.id);
});

module.exports.get_category_delete = asyncHandler(async (req, res) => {
  res.send('get delete id ' + req.params.id);
});


module.exports.post_category_delete = asyncHandler(async (req, res) => {
  res.send('post delete id ' + req.params.id);
});