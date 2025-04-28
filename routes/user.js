const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const auth = require('../middleware/auth')

//for register
router.get('/register',auth.isLogin,userController.loadRegister)
router.post('/register',userController.registerUser)

// for login
router.get('/login',auth.isLogin,userController.loadLogin)
router.post('/login',userController.login)

// for home
router.get('/home',auth.checkSession,userController.loadHome)

// for logout
router.post("/logout", auth.checkSession, (req, res) =>{
    req.session.destroy(()=>{
        res.redirect("/user/login")
    })
})

module.exports = router
