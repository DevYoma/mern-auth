import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
        message: 'API is working'
    })
}

export default test;

// update user

export const updateUser = async (req, res, next) => {
    // checking if user trying to update is the owner of the account
    if(req.user.id !== req.params.id){
        // return res.status(401).json("You can only update your account");
        return next(errorHandler(401, "You can update only your account"))
    }

    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                $set: {
                    username: req.body.username, 
                    email: req.body.email, 
                    password: req.body.password, 
                    profilePicture: req.body.profilePicture
                }
            }, 
            { new: true } // if not added you will see previous user data
        )

        // removing the password
        const { password, ...others } = updatedUser._doc;
        res.status(200).json(others);

    } catch (error) {
        next(error)
    }
}