const Item = require("../models/item")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec()

  res.render("item_detail", {
    title: "Item Details",
    item: item,
  })
})

exports.item_create = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({})

  res.render("item_form", {
    categories: categories,
    item: {name: undefined, category: undefined, author: undefined, price: undefined, description: undefined}
  })
})

exports.item_post = [
  body("item_name", "Item must contain atleast 3 characters")
    .trim()
    .isLength({min: 3})
    .escape(),

  body("item_des", "Item description must atleast contain 5 characters")
    .trim()
    .isLength({min: 5})
    .escape(),

  body("author", "Author must contain minimum of 3 characters")
    .trim()
    .isLength({min: 3})
    .escape(),
  
  body("item_price", "Price must contain atleast some value (if free enter $0)")
    .trim()
    .isLength({min: 3})
    .escape(),

  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req)

    const newItem = new Item({
      name: req.body.item_name,
      description: req.body.item_des,
      category: req.body.category,
      author: req.body.author,
      price: req.body.item_price
    })


    if(!errors.isEmpty()) {
      const categories = await Category.find({}).exec()

      res.render("item_form", {
        title: "Item creation",
        categories: categories,
        errors: errors.array(),
        item: newItem
      })
    }
    else {
      await newItem.save()
      res.redirect(newItem.url)
    }
  })
]

exports.item_delete = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.body.del_item).exec()
  res.redirect("/")
})

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).exec()
  const prev = await Item.findById(req.params.id).exec()

  res.render("item_form", {
    title: "Item update",
    categories: categories,
    item: prev
  })
})

exports.item_update_post = [
  body("item_name", "Item must contain atleast 3 characters")
    .trim()
    .isLength({min: 3})
    .escape(),

  body("item_des", "Item description must atleast contain 5 characters")
    .trim()
    .isLength({min: 5})
    .escape(),

  body("author", "Author must contain minimum of 3 characters")
    .trim()
    .isLength({min: 3})
    .escape(),
  
  body("item_price", "Price must contain atleast some value (if free enter $0)")
    .trim()
    .isLength({min: 3})
    .escape(),

  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req)

    const newItem = new Item({
      name: req.body.item_name,
      description: req.body.item_des,
      category: req.body.category,
      author: req.body.author,
      price: req.body.item_price,
      _id: req.params.id
    })


    if(!errors.isEmpty()) {
      const categories = await Category.find({}).exec()

      res.render("item_form", {
        title: "Item update",
        categories: categories,
        errors: errors.array(),
        item: newItem
      })
    }
    else {
      await Item.findByIdAndUpdate(req.params.id, newItem).exec()
      res.redirect(newItem.url)
    }
  })
]