const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const eventSchema = new Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        name: {
            type: String,
            required: [true, "name is required"],
        },
        image: {
            type: String,
        },
        date: {
            type: String,
            required: [true, "date is required"],
        },

        type: {
            type: String,
            required: [true, "type is required"],
        },
        price: {
            type: Number,
            required: [true, "price is required"],
        },
        info: {
            type: String,
            required: [true, "info is required"],
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Event", eventSchema);
