const express=require("express");
const app=express();

const userRoutes =require("./routes/User");
const courseRoutes =require("./routes/Course");
const paymentRoutes =require("./routes/Payments");
const profileRoutes =require("./routes/Profile");
const contactUsRoute = require("./routes/Contact");


// connecting Database
const database=require("./config/database");
const cookieParser=require("cookie-parser");
// to make backend entertain frontend request we need cors package (npm i cors)
const cors=require("cors");


// connection to cloudinary
const {cloudinaryConnect}=require('./config/cloudinary');
// importing file uploader
const fileUpload=require("express-fileupload");

const dotenv=require("dotenv");
dotenv.config();

// port setup
const PORT=process.env.PORT || 4000;

// connect to database
database.connectDB();

// add middleWares
app.use(express.json());
app.use(cookieParser());
app.use(
    // entertain request from frontend at 3000 port
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// default route
app.get("/", (req,res)=>{
    return res.status(404).json({
        success:true,
        message:"Your server is Up and Running..."
    })
})

// activating the server
app.listen(PORT, ()=>{
    console.log(`Your app is Running at ${PORT}`)
});