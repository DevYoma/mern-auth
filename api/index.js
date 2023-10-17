import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js';

dotenv.config(); // allows us use DOT env files


const app = express();

app.use(express.json())

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server listening on port 3000');
    })
}).catch((err) => {
    console.log(err);
})

app.use('/api/user', userRoutes)

app.use('/api/auth', authRoutes)