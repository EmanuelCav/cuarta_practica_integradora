import passport from 'passport';

import MongoUserManager from '../dao/MongoUserManager.js';

import CustomErrors from '../lib/errors.js';

import { statusMessage, nameMessage } from '../helper/statusMessage.js';
import { linkToken } from '../helper/token.js';

const userManager = new MongoUserManager()

export const users = async (req, res) => {

    try {

        const result = await userManager.getUsers()

        return res.status(statusMessage.OK).json(result)

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const forgotPassword = async (req, res) => {

    const { email } = req.body

    try {

        const result = await userManager.passwordForgot(email)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists", statusMessage.BAD_REQUEST)
        }

        const token = linkToken(email)

        return res.status(statusMessage.OK).json({
            message: "Check your email",
            token
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const recoverPassword = async (req, res) => {

    const { email } = req.params
    const { password } = req.body

    try {

        const result = await userManager.passwordRecover(email, password)

        if (!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or password is not avaible", statusMessage.BAD_REQUEST)
        }

        return res.status(statusMessage.OK).json({
            message: "Password updated successfully",
            user: result
        })

    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const login = passport.authenticate('login', {
    failureRedirect: '/login',
    successRedirect: '/products',
    successFlash: true,
    failureFlash: true,
    session: false
})

export const register = passport.authenticate('register', {
    failureRedirect: '/register',
    successRedirect: '/products',
    successFlash: true,
    failureFlash: true,
    session: false
})

export const updatePremium = async (req, res) => {

    const { id } = req.params

    try {

        const result = await userManager.userPremium(id)

        if(!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or documents have not valid information", statusMessage.BAD_REQUEST)
        }

        return res.status(200).json({ message: "Now user is premium" })
        
    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

export const uploadDocument = async (req, res) => {

    const { uid } = req.params

    try {

        if(req.files.length === 0) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "You have to upload a file", statusMessage.BAD_REQUEST)
        }

        const result = await userManager.documents(uid, req.files)

        if(!result) {
            CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or user is not premium", statusMessage.BAD_REQUEST)
        }

        return res.status(200).json({ message: "File uploaded successfully" })
        
    } catch (error) {
        req.logger.error(error.message)
        CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
    }

}

// export const login = async (req, res) => {

//     const { email, password } = req.body

//     try {

//         if (!email || !password) {
//             CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or password is incorrect", statusMessage.BAD_REQUEST)
//             // return res.render('login', {
//             //     layout: 'home',
//             //     error: 'There are empty fields'
//             // })
//         }

//         const user = await User.findOne({ email })

//         if (!user) {
//             CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or password is incorrect", statusMessage.BAD_REQUEST)
//         }

//         const verifyPassword = await bcryptjs.compare(password, user.password)

//         if (!verifyPassword) {
//             CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists or password is incorrect", statusMessage.BAD_REQUEST)
//         }

//         const token = generateToken(user._id, user.role, user.email)

//         return res.status(statusMessage.OK).json({
//             message: "Welcome",
//             token,
//             user
//         })

//     } catch (error) {
//         req.logger.error(error.message)
//         CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
//     }

// }

// export const register = async (req, res) => {

//     const { email, password, firstname, lastname, phone, confirm } = req.body

//     try {

//         if (!email || !password || !firstname || !lastname || !phone || !confirm) {
//             CustomErrors.generateError(nameMessage.BAD_REQUEST, "There are empty fields", statusMessage.BAD_REQUEST)
//         }

//         if (password.length < 6) {
//             CustomErrors.generateError(nameMessage.BAD_REQUEST, "Password must have more than 5 characters", statusMessage.BAD_REQUEST)
//         }

//         if (confirm !== password) {
//             CustomErrors.generateError(nameMessage.BAD_REQUEST, "Passwords do not match", statusMessage.BAD_REQUEST)
//         }

//         const userExists = await User.findOne({ email })

//         if (userExists) {
//             CustomErrors.generateError(nameMessage.BAD_REQUEST, "User is already registered", statusMessage.BAD_REQUEST)
//         }

//         const salt = await bcryptjs.genSalt(8)
//         const hash = await bcryptjs.hash(password, salt)

//         const newUser = new User(new RegisterDTO({
//             first_name: firstname,
//             last_name: lastname,
//             email,
//             phone,
//             password: hash,
//             role: role ? role : 'user'
//         }))

//         const userSaved = await newUser.save()

//         const user = await User.findById(userSaved._id).select("-password")

//         if (!user) {
//             CustomErrors.generateError(nameMessage.BAD_REQUEST, "User does not exists", statusMessage.BAD_REQUEST)
//         }

//         const token = generateToken(user._id, user.role, user.email)

//         await infoEmail(email)

//         return res.status(statusMessage.OK).json({
//             message: "Welcome",
//             token,
//             user
//         })

//     } catch (error) {
//         req.logger.error(error.message)
//         CustomErrors.generateError(nameMessage.INTERNAL_SERVER_ERROR, error.message, statusMessage.INTERNAL_SERVER_ERROR)
//     }

// }
