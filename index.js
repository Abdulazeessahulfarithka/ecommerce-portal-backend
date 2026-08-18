import express from "express";
import dotenv from "dotenv";
import db from "./Config/db.js"
import cors from "cors"
import userRoute from "./Route/UserRoute.js"
import productRoute from "./Route/ProductRoute.js"
import orderRoute from "./Route/OrderRoute.js"
import paymentRoute from "./Route/PaymentRoute.js"
import adminRoute from "./Route/AdminRoute.js"

dotenv.config()
console.log("Stripe key loaded:", process.env.STRIPE_SECRET_KEY ? "yes" : "NO - undefined");
const app=express()

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))


db()

//cors configuration
app.use(cors({
    origin:[
        "http://localhost:5173",
    ],
    method:["GET","POST","PUT","DELETE"],
    credentials:true,
    allowedHeaders:["Content-Type","Authorization"]
}))

//api
app.use("/api/user",userRoute)
app.use("/api/product",productRoute)
app.use("/api/order",orderRoute)
app.use("/api/payment",paymentRoute)
app.use("/api/admin",adminRoute)

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