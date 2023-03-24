const express = require('express')
const router = express.Router()

const noteRoutes = require('../controllers/noteController')


router.route('/')
    .get(noteRoutes.getAllNotess)
    .post(noteRoutes.createNewNote)
    .patch(noteRoutes.updateNote)
    .delete(noteRoutes.deleteNote)

module.exports = router