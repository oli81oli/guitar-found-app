const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const User = require("../models/user.model")
const Guitar = require("../models/guitar.model")



//UPDATE USER

router.put('/:user_id', (req, res) => {


    if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
        res.status(400).json({ message: 'Specified id is not valid' })
        return
    }

    User.findByIdAndUpdate(req.params.user_id, req.body, { new: true })
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})





// DELETE USER

router.delete('/:user_id', (req, res) => {

    Guitar.deleteMany({ owner: mongoose.Types.ObjectId(req.params.user_id) }, { new: true })
        .then(() => User.findByIdAndDelete(req.params.user_id))
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})




//ADD FAVOURITES

router.patch('/add-favourites', (req, res) => {


    const { user, guitar } = req.body

    User.findByIdAndUpdate(user, { $push: { favGuitars: guitar } }, { new: true })
        .populate('favGuitars')
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})


//REMOVE FAVOURITES

router.patch('/delete-favourites', (req, res) => {
    const { user, guitar } = req.body

    User.findById(user)
        .then((response) => {

            const { favGuitars } = response
            const filteredGuitars = favGuitars.filter((guitarId) => guitarId.toString() !== guitar)

            return User.findByIdAndUpdate(user, { favGuitars: filteredGuitars }, { new: true })
                .populate('favGuitars')
        })
        .then(response => res.json(response.favGuitars))
        .catch(err => res.status(500).json(err))
})




//FIND USER
router.get('/:id', (req, res) => {

    User.findById(req.params.id)
        .populate('favGuitars')
        // .populate('marketGuitars')
        .then(response => res.json(response))
        .catch(err => next(new Error(err)))
})




module.exports = router


























// //ADD MARKET

// router.post('/add-market', (req, res) => {


//     const { user, guitar } = req.body

//     User.findByIdAndUpdate(user, { $push: { marketGuitars: guitar } }, { new: true })
//         .populate('marketGuitars')
//         .then(response => res.json(response))
//         .catch(err => res.status(500).json(err))
// })


// //REMOVE MARKET

// router.patch('/delete-market', (req, res) => {
//     const { user, guitar } = req.body

//     User.findById(user)
//         .then((response) => {
//             const { marketGuitars } = response
//             const filteredGuitars = marketGuitars.filter((guitarId) => guitarId.toString() !== guitar)

//             return User.findByIdAndUpdate(user, { marketGuitars: filteredGuitars }, { new: true })
//                 .populate('marketGuitars')
//         })
//         .then(response => res.json(response.marketGuitars))
//         .catch(err => res.status(500).json(err))
// })