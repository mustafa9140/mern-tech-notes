const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.log(process.env.DATABASE_URI)
        console.log("Unable to connect to mongodb server")
        console.log(err);
    }
}

module.exports = connectDB;



