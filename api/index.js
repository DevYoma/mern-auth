import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // allows us use DOT env files


const app = express();;

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server listening on port 3000');
    })
}).catch((err) => {
    console.log(err);
})