import { Journal } from "../models/MoodModel.js";
import { User } from "../models/UserModel.js";
import { sendEmail } from "../utils/sendMail.js";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import { getIdFromToken } from "../utils/getIdFromToken.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const { error } = registerSchema.validate({ username, email, password });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    const { password: _, ...userWithoutPassword } = user.toObject();

    await sendEmail({
      email:user.email,
      emailType:"VERIFY",
      userId:user._id
    })

    return res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found Please Register first" });
    } else {
      const isPasswordCorrect = await user.isPasswordCorrect(password);
      const isVerified = user.isVerified;
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid Password" });
      } else {
        if (!isVerified) {
          return res
            .status(400)
            .json({ message: "Please verify your email first" });
        } else {
          const tokenData = {
            id: user._id,
            email: user.email,
          };
          const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1d",
          });

          return res.status(200).json({ message: "Login Successfully", token });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const verifyEmail = async(req,res)=>{
  const {hashedToken} = req.body
  try {
    const user = await User.findOne({verifyToken:hashedToken,verifyTokenExpiry:{$gt:Date.now()}})
    if(!user){
      return res.status(400).json({message:"The token must be expired or invalid"})
    }
    else{
      user.isVerified = true
      user.verifyToken = undefined
      user.verifyTokenExpiry = undefined
      await user.save()
      return res.status(200).json({message:"Email verified successfully"})
    }
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:error.message})
    
    
  }
}


export const getUserData = async(req,res)=>{

  const {token} = req.body
  try {
    const userId = getIdFromToken(token)
    const user = await User.findById(userId)
    if(!user){
      return res.status(400).json({message:"User not found"})
    }
    else{
      const journal  = await Journal.find({userId})
      let journalEntries = 0
      journal.map((item)=>{
        item.messages.map((message)=>{
          if(message.role === "user"){
            journalEntries++
          }
        })
      })
      let moodsLogs = user.moodLogs.length
      
      let uniqueDates = [];
      journal.map((item) => {
        let date = item.createdAt.toISOString().split("T")[0];
        
        if (!uniqueDates.includes(date)) {
          uniqueDates.push(date);
        }
      });
      
      let daysActive = uniqueDates.length
      return res.status(200).json({user,daysActive,journalEntries,moodsLogs})
    }
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:error.message
    })
    
    
  }

}