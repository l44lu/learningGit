const userSchema = require('../model/userModel')
const bcrypt = require("bcrypt")
const saltround = 10

const registerUser = async (req,res)=>{
    try{
        const{email,password} = req.body

        const user = await userSchema.findOne({email})

        if(user){
            return res.render('user/register',{message:'user already exists'})
        } 

            const hashedpassword = await bcrypt.hash(password, saltround)



        const newUser = new userSchema({
            email,
            password:hashedpassword
        })

        await newUser.save()

         return res.render('user/login',{message:'User created successfully'})


    }catch(error){
        console.log(error);
        return res.render("user/register", { message: "An error occurred. Please try again." })
        

    }
}

// for login a user
const login = async (req,res)=>{
    try{
        const {email,password} = req.body

        const user = await userSchema.findOne({email})

        if(!user){ 
            return res.render('user/login',{message:'User does not exits'})
        }
            
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.render("user/login", {message: "Incorrect Password"})
        }

                req.session.user = true
                
                req.session.userData = {email: user.email}
                

                res.render('user/userHome',{message:'login successfully'})
    }catch(error){
        console.error(error);
        res.render("user/login", { message: "An error occurred. Please try again." })
}
}

const loadLogin = async(req,res)=>{
    res.render('user/login',{message:null})
}

const loadRegister = async(req,res)=>{
    res.render('user/register')
}

const loadHome =  (req, res)=>{
    if (!req.session.user) {
        return res.redirect("/user/login",{message:null});
    }
    const userEmail = req.session.userData.email;



    res.render("user/userHome", { email: userEmail})
 }

const logout = (req, res) => {
    req.session.user = null;
    req.session.userData = null;
    res.redirect("/user/login",{message:null});

 }

module.exports = {
    registerUser,

    loadRegister,

    loadLogin,
    
    login,

    loadHome,

    logout
}