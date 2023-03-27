const express = require("express")
require('dotenv').config()
const { connection } = require("../config/db")
const { userModel } = require("../model/user.model")
const { weatherModel } = require("../model/weather.model")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { createClient } = require("redis");
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();
const app = express()
app.use(express.json())

const weatherRoute= express.Router()

weatherRoute.get("/set", async (req, res) => {
    let { city } = req.query
    let val = Math.floor(Math.random() * 100)
    const data = new weatherModel({ city: city, temp: val })
    await data.save()
    res.send("Weather set")
})

weatherRoute.get("/get", async (req, res) => {
    let { city } = req.query
const value = await client.hGet("whm",`${city}`)
if(value){
    res.send(value)
}
else{
let data = await weatherModel.find({city:city})
await client.hSet("whm",`${data[0].city}`,`${data[0].temp}`);
res.send(data[0].temp)
}
})

module.exports={
    weatherRoute
}