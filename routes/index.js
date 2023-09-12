var express = require('express');
var router = express.Router();

const Item = require("../models/item")
const Category = require("../models/category")
const itemController = require("../controllers/itemController")
const categoryController = require("../controllers/categoryController")

/* GET home page. */
router.get('/', async function(req, res, next) {
  const [allItems, allCategories] = await Promise.all([
    await Item.find({}).sort({name: 1}).exec(),
    await Category.find({}, "name").sort({name: 1}).exec()
  ])
  res.render('index', { title: 'Inventory', categories: allCategories, items: allItems });
});


router.get("/item/:id", itemController.item_detail)
router.get("/category/:id", categoryController.category_detail)
router.get("/create/item", itemController.item_create)
router.get("/create/category", categoryController.category_create)
router.post("/create/item", itemController.item_post)
router.post("/create/category", categoryController.category_post)
router.post("/item/:id", itemController.item_delete)
router.post("/category/:id", categoryController.category_delete)
router.get("/item/:id/update", itemController.item_update_get)
router.post("/item/:id/update", itemController.item_update_post)
router.get("/category/:id/update", categoryController.category_update_get)
router.post("/category/:id/update", categoryController.category_update_post)

module.exports = router;
