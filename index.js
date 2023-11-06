const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.set("strictQuery",true);
mongoose.connect("mongodb+srv://KPS:1234@cluster0.vzaxyw0.mongodb.net/blog");
var db = mongoose.connection;
db.on("open",()=>console.log("Connected to DB"));
db.on("error",()=>console.log("Error occurred"));

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    phno: String,
    password: String,
    dob: Date
},{
    collection: "User"
});

const app = express();
app.use(express.json());
app.use(cors());

const User = new mongoose.model("User",userSchema)

app.post("/login", (req, res)=> {
    const { username, password} = req.body
    User.findOne({ username: username}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Incorrect Password"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res) => {
    const { name, username, email, phno, password, dob } = req.body;
  
    // Check if the email already exists
    User.findOne({ email: email }, (err, existingEmailUser) => {
      if (err) {
        res.status(500).json({ message: "Server error" });
      } else if (existingEmailUser) {
        res.status(400).json({ message: "Email already registered" });
      } else {
        // Check if the username already exists
        User.findOne({ username: username }, (err, existingUsernameUser) => {
          if (err) {
            res.status(500).json({ message: "Server error" });
          } else if (existingUsernameUser) {
            res.status(400).json({ message: "Username already exists" });
          } else {
            // If both email and username are unique, create a new user
            const user = new User({
              name,
              username,
              email,
              phno,
              password,
              dob
            });
  
            user.save((err) => {
              if (err) {
                res.status(500).json({ message: "Registration failed" });
              } else {
                res.status(200).json({ message: "Successfully Registered. Please login now." });
              }
            });
          }
        });
      }
    });
});

app.listen(4000,() => {
    console.log("Server started at 4000")
})
