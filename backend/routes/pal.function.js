import mongoose from "mongoose";
import Pal from '../models/Pal.js';

export const addNewPal = async (req, res) => {
    console.log("add new pal");
    const pal = req.body;

    if (!pal.name || !pal.image || !pal.personality?.description) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    // Associate pal with logged-in user
    const newPal = new Pal({
        ...pal,
        createdBy: req.user._id
    });

    try {
        await newPal.save();
        console.log("created pal for user:", req.user._id);
        res.status(201).json(newPal);
    } catch (error) {
        console.error("Error in create pal: ", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deletePal = async (req, res) => {
    const { id } = req.params;
    console.log("ID to be deleted: ", id);
    const pal = await Pal.findById(id);

    if (!pal) {
        return res.status(404).json({ success: false, message: "Pal not found" });
    }

    // Verify ownership
    if (pal.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: "Not authorized to delete this pal" });
    }

    try {
        await Pal.findByIdAndDelete(id).then(doc => console.log("Deleted pal: ", doc));
        res.status(200).json({ success: true, message: "Pal deleted successfully" });
    } catch (error) {
        console.error("Error in delete pal: ", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const updatePal = async (req, res) => {
    const { id } = req.params;
    const pal = await Pal.findById(id);

    if (!pal) {
        return res.status(404).json({ success: false, message: "Pal not found" });
    }

    // Verify ownership
    if (pal.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: "Not authorized to update this pal" });
    }

    console.log("Updating pal with data: ", req.body);

    try {
        const updatedPal = await Pal.findByIdAndUpdate(id, req.body, { new: true });
        console.log("Updated pal: ", updatedPal);
        res.status(200).json({ success: true, message: "Pal updated successfully", pal: updatedPal });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}


export const getPals = async (req, res) => {
    try {
        // Get only pals created by the logged-in user
        const pals = await Pal.find({ createdBy: req.user._id });
        console.log(`Found ${pals.length} pals for user ${req.user._id}`);
        res.status(200).json(pals);
    } catch (error) {
        console.error("Error in get pals:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const getAPal = async (req, res) => {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id) === false) {
        return res.status(404).json({ success: false, message: "Pal not found" });
    }

    try {
        const pal = await Pal.findById(id);

        if (!pal) {
            return res.status(404).json({ success: false, message: "Pal not found" });
        }

        // Verify ownership
        if (pal.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized to view this pal" });
        }

        console.log("Fetched pal: ", pal);
        res.status(200).json(pal);
    } catch (error) {
        console.error("Error in get pal: ", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

