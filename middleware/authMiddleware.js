const isAuthenticated = (req, res, next)=> {
    if (req.session && req.session.userId) {
      return next();
    } else {
      return res.status(401).send('You are not authorized to view this resource');
    }
  }
  
  module.exports = isAuthenticated;
  