const asyncHandler = require('express-async-handler');


module.exports.get_item = asyncHandler(async (req, res) => {
  res.send('view id ' + req.params.id);
});

module.exports.get_item_edit = asyncHandler(async (req, res) => {
  res.send('get edit id ' + req.params.id);
});

module.exports.post_item_edit = asyncHandler(async (req, res) => {
  res.send('post edit id ' + req.params.id);
});

module.exports.get_item_delete = asyncHandler(async (req, res) => {
  res.send('get delete id ' + req.params.id);
});

module.exports.post_item_delete = asyncHandler(async (req, res) => {
  res.send('post delete id ' + req.params.id);
});