const express = require('express')
const app = express()
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const path = require('path')
const connectDB = require('./db/connectDB')
const session = require('express-session')
const nocache = require('nocache')



// view engine setup
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static ("public"))

app.use(nocache())

app.use(session({
    secret: 'mysecretkey',
    resave: false, 
    saveUninitialized:true, 
    cookie: {maxAge: 1000*60*30}
}))


// parsing incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//module.imports
app.use('/user',userRouter)
app.use('/admin',adminRouter)

connectDB()


app.get("/admin/*", (req,res) => {
  if (req.session.admin) {
    res.redirect("/admin/dashboard");
  }else{
      res.redirect("/admin/login")
  }
});
  app.get("/user/*", (req, res) => {
      if(req.session.user) {
          res.redirect("/user/home")
      }else{
          res.redirect("/user/login")
      }
  })

  
app.get('/*',(req,res)=>{
    res.redirect('/user/login')
})


app.listen(5000,()=>{
            console.log('server is loading...');
       })








