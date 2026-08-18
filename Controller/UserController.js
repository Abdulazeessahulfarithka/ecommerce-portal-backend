import User from "../Model/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export  const registerUser = async (req,res)=>{
    try{
        const {name,email,password,phone}=req.body

       if(!name || !email || !password ||!phone){
        return res.status(400).json({
            success:false,
            message:"all fields are required",
        })
       }

       const existingUser = await User.findOne({email})

       if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User alredy exits"
        })
       }
       const hashedPassword = await bcrypt.hash(password,10)

       const user = await User.create({
        name,email,password:hashedPassword,
       })
       res.status(201).json({
        success:true,
        message:"user registerd successfully",
        user,
       })
    }catch (error){
         res.status(201).json({
            success:false,
            message:error.message
         })
    }

}

export const loginUser =async (req,res)=>{

    try{
      const {email,passsword}= req.body
if(!email || !password){
    return res.status(400).json({
        success:false,
        message:"email and password required"
    })
}
 const user = await User.findOne({email})

 if(!user){
    return res.status(404).json({
        success:false,
        message:"user not found"
    })
 }
   const isMatch = await bcrypt.compare(password,user.password)

   if(!isMatch){
    return res.status(404).json({
        success:false,
        message:"invalid password"
    })
   }
  
const token = jwt.sign(  
    {
    id:user._id},
    {
        expriresIn:"7d",
    }
)

     res.status(200).json({
        success:true,
        message:"Login successful",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
        },
        token,

     })
    }catch(error){
        res.status(500).json({
            success:false,
            mesage:error.message,
        })

    }
}

export const googleSignup = async (req, res) => {
  try {
    const { credential } = req.body;
 
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }
 
    // Verify the token actually came from Google and wasn't tampered with
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
 
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
 
    // Link to an existing email/password account if one exists, otherwise create a new user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
 
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        avatarUrl: picture,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.avatarUrl = user.avatarUrl || picture;
      await user.save();
    }
 
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
 
    res.status(200).json({
      success: true,
      message: "Signed in with Google successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};