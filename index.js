require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');

const connectDB = async () =>{
    try {
        await mongoose.connect('mongodb+srv://tranleanhvu:1234@r2s-database.f9ywc.mongodb.net/r2s-database?retryWrites=true&w=majority', {
            // Các tham số này là mặc định
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log("MongoDB Connected")
    } catch (error) {
        console.log("eror", error.message);
        // Restart lại
        process.exit(1);
    }
}
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);

const POST = process.env.POST || 5000;
app.listen(POST, () => console.log("Server started on port 5000"))