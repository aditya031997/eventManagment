const _ = require("lodash")
const Event = require("../../models/eventSchema")

exports.addEvent = async (req, res) => {
    try {
        const { name, image, date, type, price, info, } = req.body;
        let userId = req.user._id
        let newEvent = new Event({
            name, image, date, type, price, info, userId
        });
        await newEvent.save();
        return res.status(200).json({
            success: true,
            message: "event upload successfully",
            data: newEvent,
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
        });
    }
}