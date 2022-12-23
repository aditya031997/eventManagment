const bcrypt = require("bcrypt");
const _ = require("lodash")
const User = require("../../models/userSchema")
const gravitar = require('gravatar')
const { DEFAULT_EMAIL_TEMPLATE } = require("../../template/templates")
const { generateToken, comparePassword ,verifyJWT} = require("../../helper/helper")
const sendEmail = require('../../utils/sendEmail');

exports.register = async (req, res) => {
    try {
        const { email, password, confirmpassword } = req.body;

        const user1 = await User.findOne({ email });
        if (user1) {
            return res.status(400).json({
                message: "User Already Exists",
            });
        }
        bcrypt.hash(password.toString(), 10, async (err, hash) => {
            // try {
            if (err) {
                return res.status(400).json({
                    error: "Something went wrong",
                });
            }

        // let profilePicture = gravitar.url(email,{
        //     s:'200',
        //     r:'pg',
        //     d:'mm'
        // })
            // const privateKey = await createWallet()

            // const walletWithProvider = new ethers.Wallet(privateKey);
            // const walletAddress = walletWithProvider.address
            // const confirmkeyhash = await bcrypt.hash(confirmpassword.toString(), 10);


            // const confirmEmailToken = await generateEmailConfirmToken()
            // const confirmEmailURL = process.env.ADMIN_URL + `#/user/login?confirmemailtoken=${confirmEmailToken}`;

            // try {
            //   let message = `<p
            //     style="font-size: 13px;font-family: verdana, geneva, sans-serif;color: #6e6c6f">
            //     Please verify your email for Shipfinex by clicking the button.
            // </p>
            // <br />
            // <br />
            // <span class="es-button-border"
            //        style="border-radius: 20px;background: #2e9cca"><a
            //         href="${confirmEmailURL}" class="es-button" target="_blank"
            //         style="font-size:14px; background: #2e9cca;border-color: #2e9cca; border-radius: 20px;border-left-width: 20px;border-right-width: 20px">Verify My Email</a></span>`
            //   link = _.template(DEFAULT_EMAIL_TEMPLATE)({ content: message, url: (`${process.env.ADMIN_URL}#/user/login` || "").replace("#", "") + "resources/images/logo-black.png" })

            //   sendEmail({
            //     email: req.body.email,
            //     subject: 'Confirm Account',
            //     body: link,
            //   });
            // } catch (error) {
            //   res.status(500).json({
            //     message: error.message,
            //     data: {},
            //     success: false,
            //   });
            // }



            const newUser = {
                ...req.body,
                password: hash,
                //   walletKey: privateKey,
                //   confirmEmailToken: confirmEmailToken,
                //   walletAddress: walletAddress,
                //   identityAddress: ""
            };

            const createdUser = await User.create(newUser);
            const user = await User.findOne({ email });

            const token = generateToken(user);
            if (!token) {
                return res.status(206).json({
                    message: "Error in generating token",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Register successfully",
                data: createdUser,
                token: token
            });
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
            data: {},
            success: false,
        });
    }
};

exports.login = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user) {
            const validUser = await comparePassword(req.body.password, user.password);
            if (!validUser) {
                return res.status(400).json({
                    message: "Invalid username/password",
                });
            }
            if (user.role != "User") {
                return res.status(400).json({
                    message: "Invalid Credentials",
                });
            }
            const token = generateToken(user);
            if (!token) {
                return res.status(400).json({
                    message: "Error in generating token",
                });
            }

            res.status(200).json({
                message: "Logged In",
                data: {
                    user: user,
                    token: token,
                },
            });
        } else {
            res.status(400).json({
                message: "Email doesn't exists",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
            data: {},
            success: false,
        });
    }
};

exports.adminLogin = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const validUser = await comparePassword(req.body.password, user.password);
            if (!validUser) {
                return res.status(400).json({
                    message: "Invalid username/password",
                });
            }
            if (user.role != "Admin") {
                return res.status(400).json({
                    message: "You are unauthorized to Login",
                });
            }
            const token = generateToken(user);
            if (!token) {
                return res.status(400).json({
                    message: "Error in generating token",
                });
            }

            res.status(200).json({
                message: "Logged In",
                data: {
                    user: user,
                    token: token,
                },
            });
        } else {
            res.status(400).json({
                message: "Email doesn't not exists",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
            data: {},
            success: false,
        });
    }
};
exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        let result1 = await User.findOne({ email });

        if (!result1) {
            return res.status(400).send({
                message: "Email is does not exist please enter correct Email",
                code: 404,
            });
        } else {
            const token = await generateToken(result1);
            const expireToken = Date.now() + 36000000;


            let message = `<p
          style="font-size: 13px;font-family: verdana, geneva, sans-serif;color: #6e6c6f">
          please Click here  to reset your password.
      </p>
      <br />
      <br />
      <span class="es-button-border"
             style="border-radius: 20px;background: #2e9cca"><a
             href=${process.env.ADMIN_URL}#/user/resetPassword?token=${token} class="es-button" target="_blank"
  
              style="font-size:14px; background: #2e9cca;border-color: #2e9cca; border-radius: 20px;border-left-width: 20px;border-right-width: 20px">Forget Password</a></span>`
            link = _.template(DEFAULT_EMAIL_TEMPLATE)({ content: message, url: (`${process.env.ADMIN_URL}#/user/resetPassword` || "").replace("#", "") + "resources/images/logo-black.png" })
            await sendEmail({
                email: req.body.email,
                html: ` <a>please Click here  to reset your password</a>`,
                body: link,
                subject: "Forget Password Email"

            });

            return res.status(200).json({
                message: "Email sent successfully",
                token:token
            });
        }
    } catch (error) {
        console.log("err", error)
        return res.status(500).json({
            message: "Internal Server Error",
            error,
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { resetLink, password } = req.body;
    try {
        if (resetLink) {
            let decodedData = verifyJWT(resetLink);
            const id = decodedData.data;

            const users = await User.findOne(id);
            if (users) {
                await User.find({ resetLink: resetLink });
                try {
                    if (!users) {
                        return res.status(500).json({
                            message: "User with this email does not Exists",
                        });
                    }
                    let salt = await bcrypt.genSalt(10);
                    bcrypt.hash(password.toString(), 10, async (err, hash) => {
                        let decodedData = verifyJWT(resetLink);
                        try {
                            const obj = {
                                password: hash,
                            };
                            let userid = decodedData.data._id;
                            const user = await User.findByIdAndUpdate(userid, obj);
                            return res.status(201).json({
                                success: true,
                                message: "Password Changed Successfully",
                                data: user,
                            });
                        } catch (err) {
                            return res.status(500).json({
                                error: err.message,
                            });
                        }
                    });
                } catch (error) {
                    return res.status(500).json({
                        error: error.message,
                    });
                }
            } else {
                return res.status(500).json({
                    message: "Incorrect token or it is expired!",
                });
            }
        } else {
            if (err || !user) {
                return res.status(500).json({
                    error: " error!",
                });
            }
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

exports.changePassword = async (req, res) => {
    // return console.log(req.user)
    let decoded = req.user;
    try {
        if (!req.body.oldPassword && !req.body.newpassword) {
            return res.send({
                status: 500,
                message: "Input can't be empty",
            });
        }
        const validPassword = await comparePassword(req.body.oldPassword, decoded.password);

        if (decoded && validPassword) {
            const _id = decoded._id;
            const password = await bcrypt.hash(req.body.newpassword, 10);
            const payload = { password: password };
            const data = await User.findByIdAndUpdate({ _id: _id }, payload);
            return res.status(200).send({
                statusCode: 200,
                message: "Password changed successfully",
            });
        } else {
            return res.status(400).json({
                statusCode: 400,
                data: data,
                message: "Old Password is not matched",
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Old Password is not matched" });
    }
};