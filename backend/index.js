const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const checkAuthorization = require('./verifyToken');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB Atlas 
mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("connected to mongodb waterMotor"))
        .catch((err) => console.log("not connected to mongodb waterMotor"));

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: [true, "First name is required"]
    },
    lname: {
        type: String,
        required: [true, "Second name is required"]
    },
    profile: {
        filename: String,
        contentType: String,
        data: Buffer
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String, 
        required: [true, "Password is required"] 
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
})

const Motorfile = mongoose.model('Motorfile', userSchema);

/** User Motor Detail Model */

const motorSchema = mongoose.Schema({
    userName: Array,
    userEmail: Array,
    startTime: Date,
    stopTime: Date,
    status: {
        type: Boolean,
        default: false
    }
})

const Motorhistory = mongoose.model('Motorhistory', motorSchema);

const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(express.json());


app.post('/login', async (req, res) => {
    console.log("req data: ", req.body);
    // let user;
    // let hashPwd;
    // let matchPwd;
    try{
        // if(req.body.newPassword && req.body.email) {
        //     user = await Motorfile.findOne({email: req.body.email});
        //     if(!user){
        //         return res.json({"token": "no data"});
        //     }
        //     hashPwd = await bcrypt.hash(req.body.newPassword, new Date().getTime());
        //     const updatedData = await Motorfile.findByIdAndUpdate(user._id,
        //         {
        //             password: hashPwd,
        //             updatedAt: Date.now() 
        //         }, {new: true});
        //     matchPwd = await bcrypt.compare(req.body.newPassword, updatedData.password);
        //     console.log("matchPwd : " + matchPwd + " updatedData : " + updatedData);
        // } else {
        const user = await Motorfile.findOne({email: req.body.usEmail});
        if(!user){
            return res.json({"token": "no data"});
        }
        const matchPwd = await bcrypt.compare(req.body.usPassword, user.password);
        console.log("matchPwd : " + matchPwd);
        // }
        if(matchPwd){
            console.log("user._id : " + user._id);
            let token = jwt.sign({"_id": user._id}, process.env.JWT_KEY);
            // res.setHeader("Authorization", `Bearer ${token}`);
            // res.json(token);

            res.json({"token": token});
        }
        else{
            res.json({"token": "no data"});
        }
    } catch(error) {
        res.send("error: " +  error.message);
    }
});

app.put('/forgetpassword', async (req, res) => {
    try {
        console.log("req.body : " + req.body.email);
        // if(req.body.newPassword && req.body.email) {
            const user = await Motorfile.findOne({email: req.body.email});
            
            if(!user){
                return res.json({"token": "no data"});
            }
            const salt = await bcrypt.genSalt(10);
            const hashPwd = await bcrypt.hash(req.body.newPassword, salt);
            const updatedData = await Motorfile.findByIdAndUpdate(user._id,
                {
                    password: hashPwd,
                    updatedAt: Date.now() 
                }, {new: true});

            const matchPwd = await bcrypt.compare(req.body.newPassword, updatedData.password);
            // console.log("matchPwd : " + matchPwd + " updatedData : " + updatedData);

            if(matchPwd){
                console.log("user._id : " + user._id);
                let token = jwt.sign({"_id": user._id}, process.env.JWT_KEY);
                // res.setHeader("Authorization", `Bearer ${token}`);
                // res.json(token);
    
                res.json({"token": token});
            }
            else{
                res.json({"token": "no data"});
            }
        // } else{
        //     res.json({"token": "no data"});
        // }
    } catch(error) {
            res.json({"error": error.message});
    }
});

const upload = multer({storage: multer.memoryStorage() });

app.post('/signup', upload.single('profile'), async(req, res) => {
    console.log("req data : ", req.body);
    // const authHeader = req.headers['authorization']
    // console.log(authHeader);
    // const token = authHeader.split(' ')[1];
    // jwt.verify(token, "huha", (err, user) => {
    //     console.log(err);
    //     if(err)
    //         return res.status(401).send("error comes");
    //     console.log(user);
    //     req.user = user;
    // });
    // console.log(req.user);
    // if(req.user){
        const { fname, lname, email, password } = req.body;
        let profile = null;
        if(req.file){
            profile = {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
                data: req.file.buffer
            };
        }
        console.log("req.file : ", req.file);
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(password, salt);
        console.log("hashPwd : ", hashPwd);
        const savedUser = new Motorfile({fname, lname, email, password: hashPwd, profile});
        const savedUserData = await savedUser.save();
        console.log("savedUserData : " + savedUserData);
        const user = await Motorfile.findOne({email: savedUserData.email});
        console.log("user : " + user);
        if(user){
            console.log("if condition")
            let token = jwt.sign({"_id": user._id}, process.env.JWT_KEY);
            // res.setHeader("Authorization", `Bearer ${token}`);
            // res.json(token);
    
            res.json({"token": token});
        }
        else{
            console.log("else condition");
            res.send("no data");
        }
})

app.use('/users', async(req, res) => {
    await Motorfile.find()
        .then((documents) => {
            // console.log(documents);
            res.status(200).json(documents)
        });
    });

app.get('/edit/:id', checkAuthorization, async(req, res) => {
    // console.log(req.user._id + " " + req.params.id);
    let data = await Motorfile.findById(req.params.id);
    // if(req.user._id === req.params.id){
        // let newData = {...data, edit: true};
        // console.log("if " + data);
        // res.json(data);
        // console.log('if condition');
        // res.send("you can edit profile, because it's you own profile.");
    // } else{
        // console.log('else condition')
        // res.send("you cannot edit this profile, because it's not your own profile");
    //     console.log("else " + data);
    //     res.json(data);
    // }
    let login_id_and_fech_user_id= {
     current_login_user_id : req.user._id,
     fetch_user_detail: data   
    }
    console.log(login_id_and_fech_user_id);
    res.json(login_id_and_fech_user_id);
})

app.patch('/edit/:id', [checkAuthorization, upload.single('profile')], async (req, res) => {
    try{

        const checkUser = await Motorfile.findById(req.params.id);
        if(!checkUser){
            return res.status(404).json({error: "user not found"});
        }
        let profile = null;
        
        if(checkUser.profile !== null || undefined && req.file === null || undefined){
            profile = {
                filename: checkUser.profile.filename,
                contentType: checkUser.profile.contentType,
                data: checkUser.profile.data
            }
        }

        if(req.file){
            profile = {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
                data: req.file.buffer
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(req.body.password, salt);

        let updatedData = await Motorfile.findByIdAndUpdate(req.params.id,
            {
                fname: req.body.fname || checkUser.fname,
                lname: req.body.lname || checkUser.lname,
                email: req.body.email || checkUser.email,
                password: hashPwd || checkUser.password,
                profile,
                updatedAt: Date.now() 
            }, {new: true});
    
        res.json(updatedData);
    } catch(error){
        res.send(error.message);
    }
    
});

app.delete('/user/:id', checkAuthorization, async (req, res) => {
    let deletedAccount = await Motorfile.deleteOne({_id: req.params.id});
    res.json(deletedAccount);
})


app.get('/motorStatus', checkAuthorization, async (req, res) => {
    // console.log(req.params.motorStatus);
    // res.json(req.params.motorStatus);

    const start = new Date().toDateString();
    // const todayOrders = await Order.findOne({
    //         startTime: {$gte : start }
    // });
    console.log(req.query.motor);
    let getStatus = await Motorhistory.findOne({startTime: {$gte : start }}).sort({ startTime: -1 });
    console.log("getStatus : " + getStatus);
    let getLoginUserData = await Motorfile.findOne({_id: req.user._id});
    console.log("getLoginUserData : " + getLoginUserData);
    if(getStatus !== null) {
        console.log("if condition");
        let newgetStatus = {
            // login_user_id: getLoginUserData,
            // status: true
            loginUserFname: getLoginUserData.fname,
            loginUserEmail: getLoginUserData.email,
            loggedInUserId: getLoginUserData._id,
            motorStatus: getStatus.status
        };
    
        res.json(newgetStatus);
    } else {
        console.log("else condition");
        let newgetStatus = {
            loginUserFname: getLoginUserData.fname,
            loginUserEmail: getLoginUserData.email,
            loggedInUserId: getLoginUserData._id,
            motorStatus: false
        };
        res.json(newgetStatus);
    }
})

app.patch('/motorOn',checkAuthorization, async (req, res) => {
    // console.log("req.body : " + req.body);
    if(req.body.status === false){
        console.log("if : " + req.body.userEmail);
        let updatedData = await Motorhistory.findOneAndUpdate({status: true},
            {   status: req.body.status,
                stopTime: req.body.stopTime,
                // $push: {userEmail: req.body.userEmail},
                $push: {userEmail: req.body.userEmail, userName: req.body.userName},
            }, {new: true, upsert: true});

        res.json(updatedData.status);
    } else{
        console.log("else : " + req.body.userEmail);
        let updatedData = await Motorhistory.findOneAndUpdate({status: true},
        {   status: req.body.status,
            startTime: req.body.startTime,
            // $push: {userEmail: req.body.userEmail},
            $push: {userEmail: req.body.userEmail, userName: req.body.userName},
        }, {new: true, upsert: true});

        res.json(updatedData.status);
    }
    // const savedUser = new Motorhistory(req.body);
    //     const savedUserData = await savedUser.save();
    //     res.json(savedUserData.status);
})

// app.patch('/motorOff',checkAuthorization, async (req, res) => {
//     let updatedData = await Motorhistory.findOneAndUpdate({status: true},
//         req.body, {new: true});

//         res.json(updatedData.status);

//     // const savedUser = new Motorhistory(req.body);
//     //     const savedUserData = await savedUser.save();
//     //     res.json(savedUserData.status);
// })

app.get('/motorDetail', async(req, res) => {
    const start = new Date().toDateString();
    // let motorDetail = await Motorhistory.find({startTime: {$gte : start }});
    let motorDetail = await Motorhistory.find().sort({_id : -1}).limit(6);
    // console.log(motorDetail);
    res.json(motorDetail);
})

// Endpoint to get image by ID
app.get('/file/:id', async(req, res) => {
  try {
    const user = await Motorfile.findById(req.params.id);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const { profile } = user;
    // res.send({profile});

    if (profile === null || undefined) {
        return res.status(404).send('Image not found');
    }
    res.contentType(profile.contentType);

    res.send(profile.data);
  } catch (error) {
    res.status(500).send("catch error " + error.message);
  }
});

app.listen(8080, () => { console.log('server connected successfully')});
