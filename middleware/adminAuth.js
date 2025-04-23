const checkSession = (req, res, next) => {
    if (req.session.admin) {
      next();
    } else {
      return res.redirect('/admin/login')
    }
  }
  
  const isLogin = (req, res, next) => {
    if (req.session.admin) {
      return res.redirect('/admin/dashboard');
    } else {
      next();
    }
  }
  
  module.exports = {
    checkSession,
    isLogin
  };