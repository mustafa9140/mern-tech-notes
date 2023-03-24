const User = require('../models/User')
const Note = require('../models/Note')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')




// @desc Get all notes
// @route Get /notes
// @access Private
const getAllNotess = asyncHandler(async (req, res) => {

    const notes = await Note.find().lean()
    if (!notes.length) {
        return res.status(400).json({
            message: "No notes found"
        })
    }

    return res.json(notes)

})




// @desc Create a new note
// @route Post /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    
    const {
        user,
        title,
        text,
    } = req.body

    //confirm input
    if (!user || !title || !text) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }


    const noteObject = {
        user,
        title,
        text,
        completed: false
    }
    
    // res.status(200).json({
    //     message: noteObject
    // })
    //create and store note
    const note = await Note.create(noteObject)
  

    if (note) {
        res.status(201).json({
            message: `New note created`
        })
    } else {
        res.status(200).json({
            message: 'Invalid note data received'
        })
    }

   

})




// @desc Update a note
// @route Patch /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const {
        id,
        user,
        title,
        text,
    } = req.body

    if (!id || !user || !title || !text) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({
            message: "Note not found"
        })
    }

    note.user = user
    note.text = text
    user.user = title


    const updatedNote = await note.save()


    res.json({
        message: `${updatedNote.title} updated`
    })

})




// @desc Delete a user
// @route Delete /users
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const {
        id
    } = req.body
    if (!id) {
        return res.status(400).json({
            message: "ID is required"
        })
    }



    const note = await Note.findById(id)
    if (!note) {
        return res.status(400).json({
            message: "Note not found"
        })
    }
    const result = await note.deleteOne()

    const reply = `Note ${result.title} with ID ${id} deleted`
    res.json(reply)


})



module.exports = {
    getAllNotess,
    createNewNote,
    updateNote,
    deleteNote
}