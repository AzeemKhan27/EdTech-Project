const express = require('express');
const app = express();

const userRoutes = require('./routes/User')
const profileRoutes = require('./routes/Profile')
const paymentRoutes = require('./routes/Payments')
const courseRoutes = require('./routes/Course')

const dataBase = require('./config/database.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { cloudinaryConnect } = require('cloudinary');
const fileUpload = require('express-file-upload');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
dataBase.connect();

//middleware routes
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
)

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/',
    })
)

//cloudinary connection
    cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

//default route:

app.get('/', (req, res) => {
    res.status(200).json({
        success:true,
        message:'Welcome to EdTech API | server is up and running.',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});