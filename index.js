// imports
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/route');
const blogRoutes = require('./routes/blog');
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");


const app = express();
PORT = process.env.PORT || 3001

// DB Connectiom
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Error ", err));


// Middlewares

app.use(express.static("views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));


// Set Templete Engine
app.set("view engine", "ejs");


// Routes
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);


// Listin
app.listen(PORT, () => console.log(`The Server started at ${PORT}`));
