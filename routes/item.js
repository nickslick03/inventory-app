const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item');

router.get('/:id', itemController.get_item);

router.get('/:id/edit', itemController.get_item_edit);

router.post('/:id/edit', itemController.post_item_edit);

router.get('/:id/delete', itemController.get_item_delete);

router.post('/:id/delete', itemController.post_item_delete);

module.exports = router;