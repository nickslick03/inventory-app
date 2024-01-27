const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Items = require('../models/item');
const { body, validationResult } = require('express-validator');

const categoryValidation = () => [
  body('name', 'Name must be between 1 to 20 characters')
    .trim()
    .isLength({ min: 1, max: 20 })
    .escape(),
  body('description', 'Description must be between 1 to 200 characters')
    .trim()
    .isLength({ min: 1, max: 200 })
];

module.exports.category = asyncHandler(async (req, res, next) => {
  res.redirect(req.baseUrl + '/all');
});

module.exports.get_category_all = asyncHandler(async (req, res, next) => {

  const categories = await Category.find({}).exec();

  res.render('category/all', {
    title: 'All Categories',
    categories
  })
});

module.exports.get_category_create = asyncHandler(async (req, res) => {
  res.render('category/form', {
    title: 'Create Category'
  });
});

module.exports.post_category_create = [

 ...categoryValidation(),

  asyncHandler(async (req, res) => {
    
    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.render('category/form', {
        title: 'Create Category',
        category,
        errors: result.array()
      });
      return;
    } else {
      await category.save();
      res.redirect('/category/all');
    }
  })
];

module.exports.get_category = asyncHandler(async (req, res, next) => {

  const [ category, items ] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Items.find({category: req.params.id}, { description: 0 })
  ]);

  if (category == null) {
    const err = new Error('Category not found.');
    err.status = 404;
    next(err);
    return;
  }

  res.render('category/detail', {
    title: category.name,
    category,
    items
  });
});

module.exports.get_category_edit = asyncHandler(async (req, res) => {
  
  const category = await Category.findById(req.params.id);

  if (category == null) {
    const err = new Error(404);
    err.status = 'Category not found';
    next(err);
    return;
  }

  res.render('category/form', {
    title: 'Edit Category',
    category
  });
});

module.exports.post_category_edit = [
  
  ...categoryValidation(),

  asyncHandler(async (req, res) => {
    
    const result = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });
    

    if (!result.isEmpty()) {
      res.render('category/form', {
        title: 'Edit Category',
        category,
        errors: result.array()
      })
      return;
    }

    const oldCategory = await Category.countDocuments({_id: req.params.id});

    if (oldCategory == 0) {
      const err = new Error('Category not found');
      err.status = 404;
      next(err);
      return;
    }

    await Category.findByIdAndUpdate(req.params.id, category);
    res.redirect(category.url);
  })
];

module.exports.get_category_delete = asyncHandler(async (req, res) => {

  const items = await Items.find({ category: req.params.id });

  res.render('category/delete', {
    title: 'Delete Category',
    items
  });
});

module.exports.post_category_delete = asyncHandler(async (req, res) => {
  
  const items = await Items.find({ category: req.params.id });

  if (items.length > 0) {
    res.render('category/delete', {
      title: 'Delete Category',
      items
    });
    return;
  }

  await Category.findByIdAndDelete(req.params.id);

  res.redirect('/category/all');
});