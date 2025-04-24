const mongoose = require('mongoose');
require('dotenv').config();
// const { TRUE } = require('node-sass');
const uri = process.env.URI_MONGODB_CLOUD;
// const uri = 'mongodb://127.0.0.1:27017/nest_ecommerce'

const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connected to MongoDB Atlas');
        })
        .catch((error) => {
            console.log(error);
        });
}

module.exports = { connect };
