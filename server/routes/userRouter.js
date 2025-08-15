import express from 'express'
import { adminLogin, getUser, removeUser, updateUser, userLogin, userRegister } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.post('/admin', adminLogin)
userRouter.post('/remove', removeUser)
userRouter.put('/update/:id', updateUser)
userRouter.get('/users', adminAuth, getUser)

export default userRouter;