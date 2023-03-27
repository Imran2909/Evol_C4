const express = require("express")
require('dotenv').config()
const { connection } = require("./config/db")
const { userModel } = require("./model/user.model")
const { weatherModel } = require("./model/weather.model")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { createClient } = require("redis");
const { userRouter } = require("./userRoute/user.route");
const { weatherRoute } = require("./userRoute/weather.route");
const {authentication} = require("./middleware/middleware")
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();
const app = express()
app.use(express.json())
app.get("/", (req, res) => {
    res.send("ok")
})

app.use("/user", userRouter)

app.use(authentication)

app.use("/weather",weatherRoute)

app.listen(process.env.PORT, async (req, res) => {
    await connection
    console.log("Connected to DB")
    console.log("server started")
})