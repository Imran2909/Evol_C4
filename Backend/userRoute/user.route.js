
const express = require("express")
require('dotenv').config()
const { connection } = require("../config/db")
const { userModel } = require("../model/user.model")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { createClient } = require("redis")
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

const app = express()
app.use(express.json())

const userRouter = express.Router()

userRouter.post("/signup", async (req, res) => {
    try {
        const { name, email, pass } = req.body
        bcrypt.hash(pass, 3, async (err, hash) => {
            if (err) res.send(err)
            else {
                const data = new userModel({ name, email, pass: hash })
                await data.save()
                res.send({"msg":"Signed up successful"})
            }
        });
    } catch (error) {
        res.send(error)
    }
})

userRouter.post("/login", async (req, res) => {
    try {
        const { email, pass } = req.body
        const user = await userModel.find({ email: email })
        if (user.length > 0) {
            bcrypt.compare(pass, user[0].pass, (err, result) => {
                if (err) res.send(err)
                else {
                    var token = jwt.sign({ userID: user[0]._id }, process.env.Secret);
                    res.send({ "msg": "login successful", token })
                }
            });
        }
    } catch (error) {

    }
})

userRouter.post("/logout", async (req, res) => {
    try {
        const token = req.header.authorization
        const user = req.body.email
        const value = await client.hGet("userhm",`${user}`)
        if(value){
            res.send("You are already logged out")
        }
        else{
        await client.hSet("userhm",`${user}`,`${token}`);
        res.send({"msg":"Logout success"})
        }
    } catch (error) {
        res.send(error)
    }
})

module.exports={
    userRouter
}