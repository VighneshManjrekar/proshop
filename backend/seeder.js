import dotenv from "dotenv";
import colors from "colors";

import users from "./data/user.js";
import products from "./data/products.js";

import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

import connectDB from "./config/db.js";
dotenv.config();

connectDB();

const importData = async () => {
  try {
    // delete existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // create user and get admin user id
    const createdUser = await User.insertMany(users);
    const adminUser = createdUser[0]._id;

    // add admin userid to the product schema
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });
    // create products
    await Product.insertMany(sampleProducts);

    console.log("Data imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data deleted!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] == "-d") {
  destroyData();
} else {
  importData();
}
