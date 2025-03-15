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


const User=require("./models/user.model");
const Note=require("./models/note.model");

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

//add-note
app.post("/add-note", authonticationToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const {user}= req.user;  

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully!",
        });
    } catch (error) {
        console.error("Error adding note:", error);  // ✅ Log error for debugging
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

//edit-note
app.put("/edit-note/:noteId", authonticationToken, async (req, res) => {
    const noteId=req.params.noteId;
    const{title,content,tags,isPinned}=req.body;
    const {user}=req.user;

    if(!title && !content && !tags){
        return res.status(400).json({
            error:true,
            message:"no changes provided"
        });
    }
    try{
        const note=await Note.findOne({_id:noteId,userId:user._id});

        if(!note){
            return res.status(404).json({
                error:true,
                message:"Note not found"
            });
        }
        if(title)note.title=title;
        if(content)note.content=content;
        if(tags)note.tags=tags;
        if(isPinned)note.isPinned=isPinned;

        await note.save();
        return res.json({
            error:false,
            note,
            message:"Note Upadted Successfully!"
        });

    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error",
        });
    }
});

//get all -notes
app.get("/get-all-notes", authonticationToken, async (req, res) => {
    const {user}=req.user;
    try{
        const notes=await Note.find({userId:user._id          
        }).sort({
                isPinned:-1
        });
        return res.json({
            error:false,
            notes,
            message:"All notes are reviewd successfuly!",
        });

    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal serverv error"
        });
    }
});

//delete note
app.delete("/delete-note/:noteId", authonticationToken, async (req, res) => {
    const noteId=req.params.noteId;
    const {user}=req.user;
    try{
        const note=await Note.findOne({_id:noteId,userId:user._id

        });
        if(!note){
            return res.status(404).json({
                error:true,
                message:"Note not found"
            });
        }

        await Note.deleteOne({_id:noteId,userId:user._id});
        return res.json({
            error:false,
            message:"Note deleted successfully!",
            
        });
        
    }catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal server error"
        });
    }
});



app.listen(8000);
module.exports=app;
