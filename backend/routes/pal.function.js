import mongoose from "mongoose";
import Pal from '../models/Pal.js';

export const addNewPal = async (req, res) => {
    const pal = req.body; // user will send this data

    if (!pal.name || !pal.image) {
        return res.status(400).json({success: false, message: "Please provide all fields"});
    }

    const newPal = new Pal({...pal, createdBy: req.user._id});

    try {
        await newPal.save();
        res.status(201).json(newPal);
    } catch (error) {
        console.error("Error in create pal: ", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const deletePal = async (req, res) => {
    const {id} = req.params;
    console.log("ID to be deleted: ", id);
    const pal = await Pal.findById(id);

    if (!pal) {
        res.status(404).json({success: false, message: "Pal not found"});
        return;
    }

    if (pal.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({success: false, message: "Not authorized to delete this pal"});
    }

    try {
        await Pal.findByIdAndDelete(id).then(doc => console.log("Deleted pal: ", doc));
        res.status(200).json({success: true, message: "Pal deleted successfully"});
        await Pal.find().then(pals => console.log("Remaining pals: ", pals));
    } catch (error) {
        console.error("Error in delete pal: ", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const updatePal = async (req, res) => {
    const {id} = req.params;
    const pal = Pal.findById(id);

    if (!pal) {
        return res.status(404).json({success: false, message: "Pal not found"});
    }
    console.log("Updating pal with data: ", req.body);

    try {
        await Pal.findByIdAndUpdate(id, req.body, {new: true}).then(doc => console.log("Updated pal: ", doc));  
        res.status(200).json({success: true, message: "Pal updated successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: "Server error"});
    }
}


export const getPals = async (req, res) => {
    try {
        const pals = await Pal.find({createdBy: req.user._id});
        res.status(200).json(pals);
    } catch (error) {
        console.error();
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const getAPal = async (req, res) => {
    const {id} = req.params;
    
    if (mongoose.Types.ObjectId.isValid(id) === false) {
        res.status(404).json({success: false, message: "Pal not found"});
        return;
    }

    try {
        const pal = await Pal.findById(id);
        console.log("Fetched pal: ", pal);
        res.status(200).json(pal);
    } catch (error) {
        console.error("Error in get pal: ", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}

