var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler")

const Item = require("../models/item")
const Category = require("../models/category")
const itemController = require("../controllers/itemController")
const categoryController = require("../controllers/categoryController")

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  const [allItems, allCategories] = await Promise.all([
    Item.find({}).sort({name: 1}).exec(),
    Category.find({}, "name").sort({name: 1}).exec()
  ])
  res.render('index', { title: 'Inventory', categories: allCategories, items: allItems });
}));

//GET item details
router.get("/item/:id", itemController.item_detail)

//GET category details
router.get("/category/:id", categoryController.category_detail)

//GET item creation form
router.get("/create/item", itemController.item_create)

//GET category creation form
router.get("/create/category", categoryController.category_create)

//POST new Item
router.post("/create/item", itemController.item_post)

//POST new category
router.post("/create/category", categoryController.category_post)

//DELETE item
router.post("/item/:id", itemController.item_delete)

//DELETE category
router.post("/category/:id", categoryController.category_delete)

//GET item updation form
router.get("/item/:id/update", itemController.item_update_get)

//POST item(updated)
router.post("/item/:id/update", itemController.item_update_post)

//GET category updation form
router.get("/category/:id/update", categoryController.category_update_get)

//POST category(updated)
router.post("/category/:id/update", categoryController.category_update_post)

module.exports = router;
