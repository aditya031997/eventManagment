const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require("nodemailer");

const generateToken = (data) => {
  const payload = {
    data,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24,
  };
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    return token;
  } catch (err) {
    return false;
  }
};

const generateTokenForUSer = (data) => {
  const payload = {
    data,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24,
  };
  try {
    const token = jwt.sign(payload, process.env.USER_JWT_SECRET);
    return token;
  } catch (err) {
    return false;
  }
};

const verifyJWT = (resetToken) => {
  try {
    const legit = jwt.verify(resetToken, process.env.JWT_SECRET_KEY);
    return legit;
  } catch (err) {
    return false;
  }
};
const comparePassword = async (password, enteredPassword) => {
  const valid = await bcrypt.compare(password, enteredPassword);
  if (valid) {
    return true;
  }
  return false;
};

const transporter = nodemailer.createTransport({
  TLS: true,
  port: 587,
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const createWallet = async () => {
  try {
      const id =  await crypto.randomBytes(32).toString('hex');
      const privateKey = "0x" + id;
      return privateKey;
  } catch (error) {
      console.log("error ", error.message)
  }
}

const sendForgotPasswordMail = async (values) => {
  const { token, email } = values;
  let mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Forgot Password",
    text: "Node.js testing mail for GeeksforGeeks",
    html: ` <a>please Click here  to reset your password</a>
    
    <a href = ${process.env.FORGET_URL}/resetPassword?token=${token}>Click Here</a>
    `,

  };

  transporter.sendMail(mailOptions, async(error, result) => {

    if (result) {

        
        return  result
    } else {
      console.log("That's wassup!", error);

        
    }
  });
};

const generateEmailConfirmToken = async ()=> {
  const confirmationToken = crypto.randomBytes(20).toString('hex');

  // email confirmation token
 this.confirmEmailToken = crypto
      .createHash('sha256')
      .update(confirmationToken)
      .digest('hex');

  const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
  const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
  return confirmTokenCombined; 

 
};

const getSignedJwtTokenWithCM = async (cmToken)=> {
  return jwt.sign({ id: this._id, cmToken: cmToken, email: this.email, orgId: this.orgId._id, cmID: this.orgId.cmID, role: this.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
  });
};
module.exports = {
  verifyJWT,
  generateToken,
  comparePassword,
  sendForgotPasswordMail,
  createWallet,
  generateTokenForUSer,
  generateEmailConfirmToken,
  getSignedJwtTokenWithCM
};
