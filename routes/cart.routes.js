const express = require('express')
const router = express.Router()


const Cart = require('../models/cart.model')

//ADD TO CART
router.post('/add-cart', (req, res) => {

    Cart.create(req.body)
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})


//GET USERCART
router.get('/profile/cart', (req, res) => {

    const { userCart } = req.query
    Cart.find({ userCart })
        .populate('guitarCart')
        .populate('userCart')
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})


// DELETE GUITARCARTITEM
router.post('/delete-cartItem', (req, res) => {

    Cart.findByIdAndDelete(req.body.cartItemId)
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})


//UPDATE GUITARCART
router.put('/update-cart/:cartItem_id', (req, res) => {

    Cart.findByIdAndUpdate(req.params.cartItem_id, req.body)
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))

})

module.exports = router
