import express from "express";
import dotenv from "dotenv";
import db from "./Config/db.js"
import cors from "cors"
import userRoute from "./Route/UserRoute.js"
import productRoute from "./Route/ProductRoute.js"


dotenv.config()
const app=express()

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))


db()

//cors configuration
app.use(cors({
    origin:[
        "https://localhost:5173",
        "https://ecommerce-portal-backend-4nlt.onrender.com"
    ],
    method:["GET","POST","PUT","DELETE"],
    credentials:true,
    allowedHeaders:["Content-Type","Authorization"]
}))

//api
app.use("/api/user",userRoute)
app.use("/api/product",productRoute)

//Test route
app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"serrver is running successfully"
    })

})



//PORT
const PORT =process.env.PORT ||5000

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})