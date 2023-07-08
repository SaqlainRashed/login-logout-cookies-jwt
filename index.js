import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
    .connect("mongodb://127.0.0.1:27017", {
        dbName: "backend",
    })
    .then(()=> console.log("Database Connected"))
    .catch(e=>console.log(e));

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
});
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Message = mongoose.model('Message', messageSchema)
const User = mongoose.model('User', userSchema)

const app = express();

const users = [];

// Using middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up view engine **this remains  constant
app.set("view engine", "ejs");//either use this set or use extension ".ejs" in render

//middleware
const isAuthenticated = async (req,res,next)=>{
    const {token} = req.cookies;
    if(token) {//iff this true then go next
        const decoded = jwt.verify(token, "audfadadivdavi");

        // console.log(decoded);
        req.user = await User.findById(decoded._id);

        next();
    }
    else {
        res.redirect("/login");
    }
}

app.get("/", isAuthenticated, (req, res) =>{
    // const token = req.cookies.token;// either this or below destructured
    console.log(req.user);
    res.render("logout", {name:req.user.name});
});

app.get("/login", (req,res) =>{
    res.render("login");
});

app.get("/register", (req, res) =>{
    res.render("register");
});

app.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    let user = await User.findOne({ email });
    if(!user){
        res.redirect("/register");
    }

    // const isMatch = user.password === password;//for unencrypted passwords
    // after encryption
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.render("login",{email, message:"Incorrect Password"});
    }

    const token = jwt.sign({_id:user._id}, "audfadadivdavi");
    console.log(token);

    res.cookie("token", token,{
        httpOnly: true, expires: new Date(Date.now() +60*1000)
    });
    res.redirect("/");
});

app.post("/register", async (req, res) =>{
    const {name,email,password} = req.body;

    let user = await User.findOne({email});
    if(user){
        return res.redirect("/login");
    }

    //hashing password to save in database
    const hashedPassword = await bcrypt.hash(password,10);

    // console.log(req.body);
    user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({_id:user._id}, "audfadadivdavi");
    console.log(token);

    res.cookie("token", token,{
        httpOnly: true, expires: new Date(Date.now() +60*1000)
    });
    res.redirect("/");
});

app.get("/logout", (req, res) =>{
    res.cookie("token", null,{
        httpOnly: true, 
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});



// app.get("/add", async (req, res) =>{
//     await Message.create({ name: "Saqlain1", email: "saqlain1@gmail.com" });
//         res.send("DOne");
// });

// app.get("/success", (req, res) =>{
//     res.render("success");
// });

// app.get("/users", (req,res) =>{
//     res.json({
//         users,
//     })
// });

// app.post("/contact", async (req, res) =>{
//     // console.log(req.body);
//     // const messageData = ({name: req.body.name, email: req.body.email})
//     // console.log(messageData);
//     // await Message.create(messageData);// either can create an object and the use async fns to send data or send it in 1 line
//     // await Message.create({name: req.body.name, email: req.body.email});//to req.body can be restructure shown below
//     const {name, email} = req.body;
//     // await Message.create({name: name, email: email});//if values are same can be written once
//     await Message.create({name, email});
//     res.redirect("/success");
// });


app.listen(5000, ()=> {
    console.log("Server listening on port 5000");
});