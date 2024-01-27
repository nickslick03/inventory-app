const asyncHandler = require('express-async-handler');
const Item = require('../models/item');
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const formidable = require('express-formidable');

const itemValidationChain = () => [

  (req, res, next) => {
    req.body = req.fields;
    next();
  },

  body("name", "Name must be between 1 and 20 characters")
    .trim()
    .isLength({min: 1, max: 20})
    .escape(),

  body("category", "Category doesn't exist")
    .custom(async _id => await Category.exists({_id}) !== null),

  body("description", "Description must be between 1 and 200 characters")
    .trim()
    .isLength({min: 1, max: 200})
    .escape(),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom(price => {
      const cents = (price+'').split('.')[1];
      return cents == undefined || cents.length <= 2;
    })
    .withMessage("Price must be within a cent")
    .custom(price => +price >= 0)
    .withMessage("Price must be greater than 0"),

  body("stock", "Stock must be greater than or equal to 0")
    .custom(stock => +stock >= 0),
];

module.exports.get_item_all = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  const items = await Promise.all(categories.map(({_id}) => Item.find({category: _id})));
  categories.forEach((category, i) => category.items = items[i]);
  res.render('item/all', {
    title: 'Items',
    categories
  })
});

module.exports.get_item_create = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.render('item/form', {
    title: 'Create Item',
    categories
  });
});

module.exports.get_item = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category', {name: 1});
  if (item == null) {
    const err = new Error('Cannot find Item');
    err.status = 404;
    next(err);
    return;
  }
  res.render('item/detail', {
    title: item.name,
    item
  });
});

module.exports.post_item_create = [
  
  ...itemValidationChain(),

  asyncHandler(async (req, res, next) => {

    const result = validationResult(req);

    const data = req.files['image'].size != 0
    ? await fs.promises.readFile(req.files['image'].path)
    : undefined;

    const image = {
      data,
      contentType: 'image/png'
    };

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: data ? image : undefined,
    });

    if (!result.isEmpty()) {

      const categories = await Category.find();

      res.render('item/form', {
        title: 'Edit ' + item.name,
        item,
        categories,
        errors: result.array()
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  })
];

module.exports.get_item_edit = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (item == null) {
    const err = new Error('Cannot find Item');
    err.status = 404;
    next(err);
    return;
  }
  const categories = await Category.find();
  res.render('item/form', {
    title: 'Edit ' + item.name,
    item,
    categories
  });
});

module.exports.post_item_edit = [
  
  ...itemValidationChain(),

  asyncHandler(async (req, res, next) => {

    const result = validationResult(req);

    const data = req.files['image'].size != 0
    ? await fs.promises.readFile(req.files['image'].path)
    : undefined;

    await fs.promises.unlink(req.files['image'].path);

    const image = {
      data,
      contentType: 'image/png'
    };

    const item = new Item({
      _id: req.params.id,
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: data ? image : undefined,
    });

    if (!result.isEmpty()) {

      const categories = await Category.find();

      res.render('item/form', {
        title: 'Edit ' + item.name,
        item,
        categories,
        errors: result.array()
      });
    } else {
      await Item.findByIdAndUpdate(req.params.id, item);
      res.redirect(item.url);
    }
  })
];

module.exports.get_item_delete = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category', {name: 1});
  if (item == null) {
    const err = new Error('Cannot find Item');
    err.status = 404;
    next(err);
    return;
  }
  res.render('item/delete', {
    title: 'Delete ' + item.name,
    item,
  });
});

module.exports.post_item_delete = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/item/all');
});