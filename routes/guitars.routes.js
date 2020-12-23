const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Guitar = require('../models/guitar.model')
// const User = require('../models/user.model')



//GET ALL GUITARS

router.get('/', (req, res) => {

    Guitar.find()
        .populate('owner')
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})


//GET FILTERED GUITARS

router.get('/getFilterGuitars', (req, res) => {
    const { name, state, price } = req.query

    Guitar
        .find({
            $or: [
                { price: { $lte: price } },
                { name: name },
                { state: state }
            ]
        })
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})

//GET ONE GUITAR

router.get('/profile/getOneGuitar/:guitar_id', (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.guitar_id)) {
        res.status(400).json({ message: 'Specified id is not valid' })
        return
    }

    Guitar.findById(req.params.guitar_id)
        .populate('owner')
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})




// NEW GUITAR

router.post('/newGuitar', (req, res) => {

    Guitar.create(req.body)

        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})




// EDIT GUITAR

router.put('/editGuitar/:guitar_id', (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.guitar_id)) {
        res.status(400).json({ message: 'Specified id is not valid' })
        return
    }

    Guitar.findByIdAndUpdate(req.params.guitar_id, req.body)

        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})



// DELETE GUITAR

router.delete('/delete-guitar/:guitar_id', (req, res) => {


    Guitar.findByIdAndDelete(req.params.guitar_id)
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})




module.exports = router
