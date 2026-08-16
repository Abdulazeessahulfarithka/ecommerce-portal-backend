import express from "express";
import dotenv from "dotenv";
import db from "./Config/db.js"
import userRoute from "./Route/UserRoute.js"
import productRoute from "./Route/ProductRoute.js"


dotenv.config()
const app=express()

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))


db()


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