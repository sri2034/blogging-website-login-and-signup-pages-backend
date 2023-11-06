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
    email: String,
    password: String
},{
    collection: "User"
});

const app = express();
app.use(express.json());
app.use(cors());

const User = new mongoose.model("User",userSchema)

app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res) => {
    const {name, email, password} = (req.body)
    User.findOne({email: email},(err, user) => {
        if(user){
            res.send({message: "User already registered"})
        }else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send({message: "Successfully Registered,Please login now."})
                }
            })
        }
    })
    
})

app.listen(4000,() => {
    console.log("Server started at 4000")
})
