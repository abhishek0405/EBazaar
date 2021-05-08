const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    customerEmail: {type: String, ref: 'Customer'},
    rating: {type: Number, required: true},
    review: String,
})

// reviewSchema.index({'product': 1, 'customerEmail': 1}, {unique: true})

module.exports = mongoose.model('Review', reviewSchema)