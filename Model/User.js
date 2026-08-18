import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
     name:{
        type:String,
        required:true,
        trim:true,
     },
     email:{
        type:String,
        required:true,
     },
     password:{
        type:String,
        required:true,
     },
      phone:{
        type:String,
        required:true,
     },
     isAdmin: { type: Boolean, default: false },
     googleId: { type: String, unique: true, sparse: true },
       phone: { type: String },
    },
    { timestamps: true }
    
   
)
export default mongoose.model("users",UserSchema)