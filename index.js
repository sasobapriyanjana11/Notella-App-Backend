require("dotenv").config();

const config=require("./config.json");
const mongoose=require("mongoose");

mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB ✅");
}).catch(err => {
    console.error("MongoDB connection error ❌:", err);
});


const User=require("./models/user.model")

const express=require("express");
const cors=require("cors");
const app=express();

const jwt=require("jsonwebtoken");
const {authonticationToken}=require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin:"*" ,
    })
);

app.get("/",(req,res)=>{
    res.json({data:"hello"});
});

//create account
app.post("/create-account", async (req,res)=>{
    const {fullName,email,password}=req.body;

    if(!fullName){
        return res.status(400)
        .json({error:true,message:"full name required !"});
    }
    if(!email){
        return res.status(400)
        .json({error:true,message:"email required !"})
    }
    if(!password){
        return res.status(400)
        .json({error:true,message:"password required !"})
    }

    const isUser=await User.findOne({email:email});
    if(isUser){
        return res.json({
            error:true,
            message:"user already exist",
        });

    }

    const user=new User({
        fullName,
        email,
        password,
    });
    await user.save();

    const accessToken=jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"36000m",
    });
    return res.json({
        error:false,
        user,
        accessToken,
        message:"Registration Successfull",
    });
});

//login
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    if(!email){
        return res.status(400).json ({
            message:"email is required"
        })
    }
    if(!password){
        return res.status(400).json ({
            message:"password is required"
        })
    }
    const userInfo=await User.findOne({email:email});
    if(!userInfo){
        return res.status(400).json({message:"user not found"})
    }
    if(userInfo.email==email && userInfo.password==password){
        const user={user:userInfo}
        const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m",
        });
        return res.json({
            error:false,
            message:"Login successfull",
            email,
            accessToken,
        });
    }else{
        return res.status(400).json({
            error:true,
            message:"invalid credentials"
        })
    }


});

app.listen(8000);
module.exports=app;
