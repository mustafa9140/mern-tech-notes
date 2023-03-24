const User = require('../models/User')
const Note = require('../models/Note')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')




// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select('-password').lean()
    if (!users.length) {
        return res.status(400).json({
            message: "No users found"
        })
    }

    return res.json(users)

})




// @desc Create a new user
// @route Post /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {

    const {
        username,
        password,
        roles
    } = req.body

    //confirm input
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    //check duplicate
    const duplicate = await User.findOne({
        username
    }).lean().exec()
    if (duplicate) {
        return res.status(409).json({
            message: "Duplicate username"
        })
    }

    // Hash Password
    const hashedPwd = await bcrypt.hash(password, 10) //salt rounds
    const userObject = {
        username,
        password: hashedPwd,
        roles
    }

    //create and store user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({
            message: `New user ${username} created`
        })
    } else {
        res.status(200).json({
            message: 'Invalid user data received'
        })
    }

})




// @desc Update a user
// @route Patch /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const {
        id,
        username,
        roles,
        active,
        password
    } = req.body

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    const duplicate = await User.findOne({
        username
    }).lean()
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({
            message: "Duplicate Username"
        })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        const hashedPwd = bcrypt.hash(password, 10)
        user.password = hashedPwd
    }

    const updatedUser = await user.save()


    res.json({
        message: `${updatedUser.username} updated`
    })

})




// @desc Delete a user
// @route Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const {
        id
    } = req.body
    if (!id) {
        return res.status(400).json({
            message: "ID is required"
        })
    }

    const note = await Note.findOne({user: id}).lean().exec()
    if (note) {
        return res.status(400).json({
            message: "User has notes assigned"
        })
    }

    const user = await User.findById(id)
    if (!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }
    const result = await user.deleteOne()

    const reply= `Username ${result.username} with ID ${id} deleted`
    res.json(reply)


})



module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}