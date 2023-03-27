const express = require("express")
require('dotenv').config()
const { userModel } = require("../model/user.model")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { createClient } = require("redis")
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

const authentication = async(req,res,next)=>{
    const token = req.headers.authorization
    try {
        if(token){
            jwt.verify(token,process.env.Secret,async(err,decoded)=>{
            req.body.user = decoded.userID
            const user = await userModel.find({_id:decoded.userID})
            const mail = user.email
       const value = await client.hGet("userhm",`${mail}`)
       if(value){res.send("You are loged out please login again")}
       req.body.user= user.email
                next()
        })
        }
        else{
            res.send("Please put token first")
        }
    } catch (error) {
        
    }
}

module.exports={
    authentication
}