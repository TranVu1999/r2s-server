require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const classRouter = require('./routes/class');
const topicRouter = require('./routes/topic');
const questionRouter = require('./routes/question');
const typeFeedbackRouter = require('./routes/typeFeedback');
const feedbackRouter = require('./routes/feedback');

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
app.use('/api/class', classRouter);
app.use('/api/topic', topicRouter);
app.use('/api/question', questionRouter);
app.use('/api/type-feedback', typeFeedbackRouter);
app.use('/api/feedback', feedbackRouter);

// const POST = process.env.HOST || 5000;
// app.listen(POST, () => console.log("Server started on port 5000"))

app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });