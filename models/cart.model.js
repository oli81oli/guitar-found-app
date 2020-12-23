const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
    guitarCart: {
        type: Schema.Types.ObjectId,
        ref: 'Guitar'
    },
    userCart: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        min: 1
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Cart', cartSchema)
