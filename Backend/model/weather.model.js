const mongoose = require("mongoose")

const weatherSchema = mongoose.Schema({
    city:String,
    temp:Number
})

const weatherModel = mongoose.model("weather",weatherSchema)

module.exports={
    weatherModel
}
