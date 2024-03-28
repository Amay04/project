import {User} from "../models/user.js"
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import errorHandler from "../middlewares/error.js";

export const register = async(req , res , next)=>{
    try{
        const{name,email,password} =  req.body;
        let user = await User.findOne({email})

        if(user) return res.render("register", {error:"User Already Exist"})

        const hashedPassword = await bcrypt.hash(password , 10);

        user = await User.create({name,email, password:hashedPassword});
    

    sendCookie(user , res , "Registered and Login Successfully", 200)

    }catch(e){
       console.log(e)
    }
}

export const login = async(req,res,next)=>{
   try{
     const {email , password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user) return res.render("register" , {error : "Register First"})
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.status(404).json({
        success:false,
        message:"Invalid Email or Password"
    });

    sendCookie(user , res , `welcome back ${user.name}`, 200)
   }

catch(e){
    console.log(e)
}
}

export const logout = async(req , res)=>{
    res.status(200).cookie("token" , "" ,{
    expires: new Date(Date.now())
    }).render("home")
}