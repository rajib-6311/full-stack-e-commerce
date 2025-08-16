import validator from 'validator';
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'

const createToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
    },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    )
}

const userRegister = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        // Request body verification
        if (!name) {
            return res.json({
                success: false,
                message: 'Name is required'
            })
        }
        if (!email) {
            return res.json({
                success: false,
                message: 'Email is required'
            })
        }
        if (!password) {
            return res.json({
                success: false,
                message: 'Password is required'
            })
        }

        // email validation
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Please enter a valid email'
            })
        }

        // Cheek user status 
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: true, message: 'User already exist' })
        }

        // password validation
        if (password.length < 8) {
            return res.json({
                success: true,
                message: 'Give password more than 8 charter'
            })
        }
        // Hashing user password
        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)

        // Register a new user
        const newUser = new userModel({
            name,
            email,
            password: encryptedPassword,
            isAdmin,
        })

        // save the user in database
        await newUser.save()

        res.json({
            success: true,
            message: 'Users register successfully'
        })

    } catch (error) {
        console.log('User register ERROR', error)
        res.json({ success: true, message: error?.error })
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: 'Email is required'
            })
        }

        // If user exist 
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist"
            })
        }

        if (!password) {
            return res.json({
                success: false,
                message: 'Password is required'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user)
            res.json({
                success: true,
                token,
                message: 'Users logged in successfully'
            })
        }
        else {
            return res.json({
                success: false,
                message: 'Invalid credentials, try again'
            })
        }
    } catch (error) {
        console.log('User login ERROR', error)
        res.json({ success: true, message: error?.error })
    }
};
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: 'Email is required'
            })
        }

        // If user exist 
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist"
            })
        }

        if (!password) {
            return res.json({
                success: false,
                message: 'Password is required'
            })
        }

        if (!user?.isAdmin) {
            return res.json({
                success: false,
                message: 'You are not authorized to login'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);


        if (isMatch && user.isAdmin) {
            const token = createToken(user)
            res.json({
                success: true,
                token,
                message: 'Admin logged in successfully'
            })
        }
        else {
            return res.json({
                success: false,
                message: 'Password not matched, try again'
            })
        }

    } catch (error) {
        console.log('Admin Login error', error)
        res.json({
            success: false,
            message: error.message
        })
    }

}
const removeUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.body._id);
        res.json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.log('Removed user error', error)
        res.json({
            success: false,
            message: error.message
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const { _id, email, password, name } = req.body;
        const user = await userModel.findById(_id);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }
        if (name) user.name = name;
        if (email) {
            if (!validator.isEmail(email)) {
                return res.json({
                    success: false,
                    message: 'Please enter a valid email'
                })
            }
            user.email = email;
        }

        if (password) {
            if (password.length < 8) {
                return res.json({
                    success: true,
                    message: 'Give password more than 8 charter'
                })
            }
            // Hashing user password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
        }

        //  updating the user 
        await user.save();
        res.json({
            success: true,
            message: 'User update successfully'
        })
    } catch (error) {
        console.log('Update user error', error)
        res.json({
            success: false,
            message: error.message
        })
    }
}
const getUser = async (req, res) => {
    try {
        const total = await userModel.countDocuments({});
        const users = await userModel.find({});

        res.json({
            success: true,
            total,
            users
        })

    } catch (error) {
        console.log('Get all user error', error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

export {
    userRegister,
    userLogin,
    adminLogin,
    removeUser,
    updateUser,
    getUser,
}