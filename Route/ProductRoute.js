import express from "express"
import { createProduct,getProductById,getProducts,deleteProduct,updateProduct,addReview } from "../Controller/ProductController.js"

const router = express.Router()

router.post("/create-product",createProduct)






export default router