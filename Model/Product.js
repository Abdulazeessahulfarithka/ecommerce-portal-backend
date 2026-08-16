import mongoose from "mongoose";

const ProductSchmea = new mongoose.Schema({
    name:{
    type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        default:0
    },
    images:{
        type:[String],
        default:[]
    },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

},
{timestamps:true})

export default mongoose.model("product",ProductSchmea)