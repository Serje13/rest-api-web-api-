const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    order_id: Number,
    data: [
        {
            image: {
                name: {type: String, trim: true},
                url: {type: String, trim: true}
            }
        }
    ]

});

module.exports = mongoose.model("Order", OrderSchema);