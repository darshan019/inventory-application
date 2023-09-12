console.log("This populate some items and categories to my database")

const Item = require("./models/item")
const Category = require("./models/category")

const mongoose = require("mongoose")
require("dotenv").config()
mongoose.set("strictQuery", false)

main().catch(err => console.log(err))

const items = []
const categories = []

async function main() {
  console.log("Connecting..")
  await mongoose.connect(process.env.mongoDB)
  console.log("Connected")

  await createCategories()
  await createItems()

  console.log("Closing...")
  mongoose.connection.close()
}

async function itemCreate(
  index, name, description, category, price, author
) {
  const itemDetail = {
    name: name,
    description: description,
    category: category,
    author: author,
    price: price
  }

  const item = new Item(itemDetail)
  await item.save()
  items[index] = item
  console.log(`Added item: ${name}`)
}

async function categoryCreate(index, name, description) {
  const details = {
    name: name,
    description: description,
  }

  const category = new Category(details)
  await category.save()
  categories[index] = category
  console.log(`Added category: ${name}`)
}


async function createCategories() {
  console.log("Adding Categories...")

  await Promise.all([
    categoryCreate(0, "Book", "A medium for recording information or stories in the form of writing composed of many pages."),
    categoryCreate(1, "Electronic device", "A device that is used for audio, video, or text communication or any other type of computer or computer-like instrument"),
    categoryCreate(2, "Video Games", "An computerized game that you play on your television or on a computer screen")
  ])
}

async function createItems() {
  await Promise.all([
    itemCreate(0, "The Devastation of Baal", 
      "The Devastation of Baal, also called the Battle of Baal is a book about, the assault by the single largest concentration of the Tyranid Hive Fleet Leviathan ever encountered by Humanity upon Baal, the homeworld of the Blood Angels Chapter of Space Marines.", 
      categories[0], "$82.69", "Guy Haley"
    ),

    itemCreate(1, "MacBook",
     "Apple MacBook Air Laptop M1 chip, 13.3-inch/33.74 cm Retina Display, 8GB RAM, 256GB SSD Storage, Backlit Keyboard, FaceTime HD Camera, Touch ID. Works with iPhone/iPad; Gold", 
      categories[1], "$988.330", "Apple"
    ),

    itemCreate(2, "Spec ops the line",
     "Spec Ops: The Line is a 2012 third-person shooter video game developed by the German studio Yager Development and published by 2K. It is the tenth title, as well as a reboot, of the Spec Ops series. In the game, players can hide behind cover, vault over obstacles, and shoot enemies while utilizing a variety of gadgets. Included with the game is an online multiplayer mode, developed separately by Darkside Game Studios, allowing players to engage in both cooperative and competitive gameplay. The player controls Captain Martin Walker, who is sent into a post-catastrophe Dubai with an elite Delta Force team on a recon mission. As the story progresses, Walker's sanity begins to deteriorate as he begins to experience hallucinations and slowly realize the horror of war.", 
      categories[2], "$29.99", "Yager Development"
    )
  ])
}