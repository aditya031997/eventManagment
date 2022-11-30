const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require ("../models/userSchema")
exports.decryptToken = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // TODO :: Add user logic in auth middlware below lines
    const user = await User.findById(decoded.data._id);
    req.user = decoded;


    next();
  } catch (err) {
    next();
  }
})


const userAuth = asyncHandler(async (req, res, next) => {
if (
  !req.headers.authorization ||
  !req.headers.authorization.startsWith("Bearer") ||
  !req.headers.authorization.split(" ")[1]
) {
  return res.status(401).json({
    success: false,
    message: "Please provide the token",
  });
}
const accessToken = req.headers.authorization.split(" ")[1];
try {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
  const id = await decoded.data._id;
  req.userId = decoded.userId;
  const user = await User.findOne({ _id: id });
  // console.log(user,"user")
  if (!user)
    return res.status(401).json({
      success: false,
      message: "user not found with provided token!!",  
    });
  // console.log({user})  
  req.user = user;

  // console.log(req.user,"req.user")

  return next();
} catch (error) {
  return res.status(400).json({ success: false, message: error.message });
}
});
exports.userAuth = userAuth
// Grant access to specific roles
exports.authorize = (...roles) => {
  return [protect, (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          401
        )
      );
    }
    next();
  }];
};
