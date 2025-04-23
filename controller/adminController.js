const bcrypt = require('bcrypt');
const adminModel = require('../model/adminModel');
const userModel = require('../model/userModel');
const saltround = 10;



// fnc for load login
const loadLogin = async (req, res) => {
  res.render('admin/login', {message: null});
}

// fnc for post login
const loginAdmin =  async (req, res) => {

  try {
    
    const { email, password } = req.body;
   
    

    const admin = await adminModel.findOne({email});
    console.log(email,password);

    if (!email) return res.render('admin/login', { message:'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);

    req.session.admin = true;

    res.redirect('/admin/dashboard')
   

  } catch (error) {
    res.redirect('/admin/login');
  }

}
// fnc for load dashboard
const loadDashboard = async (req, res) => {
  try {
    const admin = req.session.admin;
    if(!admin) return res.redirect('/admin/login')
    
    const users = await userModel.find();

    res.render('admin/dashboard', { users,search :null,message:null })  
    
  } catch (error) {
    res.redirect('/admin/login')
  }
}

// fnc for logout 
const logoutAdmin = async (req, res) => {
  req.session.admin = null
  res.redirect('/admin/login');
}

// fnc for add user
const loadAddUser = async (req, res) => {
  res.render('admin/add', { message: null });
}

const createAdduser = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({email});
    if(user) return res.render('admin/add', { message: 'User already exist'})
  
    const hashedPassword = await bcrypt.hash( password, saltround); 
    const newUser = new userModel({
      email,
      password: hashedPassword
    });
  
    await newUser.save();

    const admin = req.session.admin;
    if(!admin) return res.redirect('/admin/add')
    
    const users = await userModel.find();

    res.render('admin/dashboard', {users,message:null})
  } catch (error) {
    res.render('admin/add', {message: 'Something went wrong'});
  }


}

const editUser = async (req, res) => {
  try {
    const {email, password, id} = req.body;
    const hashedPassword = await bcrypt.hash(password, saltround);
    const user = await userModel.findOneAndUpdate({_id: id}, 
      {$set:{email, password: hashedPassword}});

      res.redirect('/admin/dashboard')

  } catch (error) {
    console.log(error);
    
  }
}

const deleteUser = async (req, res) => {
  try {
    
    const { id } = req.params;
    console.log(id);
    
    const user =  await userModel.findOneAndDelete({_id: id});

    res.redirect('/admin/dashboard');

  } catch (error) {
    console.log(error);
    
  }
}

const searchUser = (req, res) => {
  const searchQuery = req.body.search;
  if (!searchQuery) {
    return res.redirect("/admin/dashboard");
  }
  userModel.find({
    email: new RegExp(searchQuery, "i")
  })
    .then(users => {
      res.render("admin/dashboard",{users, searchQuery,message: `Search result for: "${searchQuery}"`})
    })
    .catch( err => {
      console.error(err);
      res.render("admin/dashboard", {users:[], searchQuery, message: "Error retrieving users"})
    })
}

module.exports = {
  loadLogin,
  loginAdmin,
  loadDashboard,
  logoutAdmin,
  loadAddUser,
  createAdduser,
  editUser,
  deleteUser,
  searchUser
}