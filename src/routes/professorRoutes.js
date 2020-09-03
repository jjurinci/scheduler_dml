import express from 'express'

const professorLogic = require('../logic/professorLogic.js')
const router = express.Router()

router.route('/')
    .get(professorLogic.getAllProfessors)
    .post(professorLogic.postProfessor)

router.route('/:id')
    .put(professorLogic.putProfessor)
    .delete(professorLogic.deleteProfessor)

router.route('/deleteInfo/:id')
    .get(professorLogic.deleteInfoProfessor)

module.exports = router