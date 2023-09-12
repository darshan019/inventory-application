const Item = require("../models/item")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec()
  const items = await Item.find({category: req.params.id}).exec()
  res.render("category_detail", {
    category: category,
    items: items
  })
})

exports.category_create = (req, res, next) => {
  res.render("category_form", {title: "Category creation", category: {name: undefined, description: undefined}})
}

exports.category_post = [
  body("cat_name", "Category name must contain atleast 3 characters")
    .trim()
    .isLength({min: 3})
    .escape(),

  body("cat_des", "Category must contain atleast 5 characters")
    .trim()
    .isLength({min: 3})
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const category = new Category({
      name: req.body.cat_name,
      description: req.body.cat_des
    })

    if(!errors.isEmpty()) {
      res.render("category_form" ,{category: category, errors: errors.array()})
    }

    else {
      await category.save()
      res.redirect(category.url)
    }
  })
]

exports.category_delete = asyncHandler(async (req, res, next) => {
  const items = await Item.find({category: req.params.id}).exec()
  const category = await Category.findById(req.body.del_cat).exec()

  if(items.length > 0) {
    res.render("category_err", {
      title: "Items are present in the Category!",
      items: items,
      category: category
    })
  } else {
    await Category.findByIdAndRemove(req.body.del_cat).exec()
    res.redirect("/")
  }
})

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const cat = await Category.findById(req.params.id)
  res.render("category_form", {title: "Category update", category: cat})
})

exports.category_update_post = [
  body("cat_name", "Category name must contain atleast 3 characters")
    .trim()
    .isLength({min: 3})
    .escape(),

  body("cat_des", "Category must contain atleast 5 characters")
    .trim()
    .isLength({min: 3})
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const newCategory = new Category({
      name: req.body.cat_name,
      description: req.body.cat_des,
      _id: req.params.id
    })

    if(!errors.isEmpty()) {
      res.render("category_form" ,{title: "Category Update", category: newCategory, errors: errors.array()})
    }

    else {
      await Category.findByIdAndUpdate(req.params.id, newCategory, {}).exec()
      res.redirect(newCategory.url)
      
    }
  })
]