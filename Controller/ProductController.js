import Proudct from '../Model/Product.js'

export const createProduct = async(req,res)=>{
    try{
        const{name,description,price,images,stock,category}=req.body

        if(!name || !description || !price || !stock || !category){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
            const product = await Product.create({name,description,price,images,stock,category})

            res.status(201).json({
                success:true,
                message:"product create successfully",
                product,
            })
        }
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

export const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1 } = req.query;
    const limit = 12;
    const skip = (Number(page) - 1) * limit;
    const filter = {
      ...(search && { name: { $regex: String(search), $options: "i" } }),
      ...(category && { category: String(category) }),
    };

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      total,
      page: Number(page),
      pageCount: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req,res) =>{
    try{
       const product = await Product.findById(req.parms.id)

       if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
       }
       res.status(200).json({success:true, product})
    }catch(error){
           res.status(500).json({ success: false, message: error.message });
    }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Push the new stock level to every connected client viewing this product
    req.app.get("io").emit("stock:update", { productId: product._id, stock: product.stock });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id — admin only
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products/:id/reviews
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.some((r) => r.user.toString() === req.user.id);
    if (alreadyReviewed) {
      return res.status(409).json({ success: false, message: "You've already reviewed this product" });
    }

    product.reviews.push({ user: req.user.id, userName: req.user.name || "Anonymous", rating, comment });
    product.recalculateRating();
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
