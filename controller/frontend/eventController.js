const _ = require("lodash")
const Event = require("../../models/eventSchema")

exports.addEvent = async (req, res) => {
    let image = req?.file?.filename ? req?.file?.filename : null;

    try {
        const { name, date, type, price, info, } = req.body;
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

exports.getFreeEvent = async(req,res)=>{
    try {
        const event = await Event.find({type:"Free"})
        return res.status(200).json({
            success: true,
            message: "all free events",
            data: event,
        });
    } catch (error) {
        console.error(error)
    }
}
exports.getProEvent = async(req,res)=>{
    try {
        const event = await Event.find({type:"Pro"})
        return res.status(200).json({
            success: true,
            message: "all pro events",
            data: event,
        });
    } catch (error) {
        console.error(error)
    }
}

