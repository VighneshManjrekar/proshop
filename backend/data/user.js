import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@mail.com",
    password: bcrypt.hashSync("test1234", 10),
    isAdmin:true
  },
  {
    name: "Tony Stark",
    email: "tony@mail.com",
    password: bcrypt.hashSync("test1234", 10),
  },
  {
    name: "Rohit Sharma",
    email: "rohit@mail.com",
    password: bcrypt.hashSync("test1234", 10),
  },
];

export default users;