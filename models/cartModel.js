const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: {
                type: Number,
                required: true
            },
            color: {
                type: String
            },
            price: {
                type: Number,
                required: true
            },
        },
    ],
    cartTotal: {
        type: Number,
        required: true
    },
    totalAfterDiscount:Number,
    orderby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);