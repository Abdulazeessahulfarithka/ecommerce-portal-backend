
import mongoose from "mongoose"

const db = async ()=>{
    try{
     await mongoose.connect(process.env.MONGO_URL)
       console.log("mongodb is connected")
    }catch(error){
        console.error(error.message)
    }
}
export default db;