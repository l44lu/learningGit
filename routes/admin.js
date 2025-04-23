const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const adminAuth = require('../middleware/adminAuth');

router.get('/login', adminAuth.isLogin, adminController.loadLogin);
router.post('/login', adminController.loginAdmin);
router.get('/dashboard', adminAuth.checkSession, adminController.loadDashboard);
router.get('/dashboard/add', adminAuth.checkSession, adminController.loadAddUser);
router.post('/dashboard/add', adminAuth.checkSession, adminController.createAdduser);
router.post('/edit', adminAuth.checkSession, adminController.editUser)
router.get('/delete/:id', adminAuth.checkSession, adminController.deleteUser);
router.get('/logout', adminAuth.checkSession, adminController.logoutAdmin)
router.post("/searchUser", adminAuth.checkSession,adminController.searchUser)

module.exports = router;