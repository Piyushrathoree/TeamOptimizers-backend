import CropPrice from "../middlewares/models/cropPrice.model.js";

export const getCropsByCommodity = async (req, res) => {
    try {
        const { commodity } = req.params;
        const crops = await CropPrice.find({
            Commodity: commodity // Changed to exact match
        });

        if (!crops.length) {
            return res.status(404).json({ message: "No crops found for this commodity" });
        }

        res.status(200).json(crops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const searchCrops = async (req, res) => {
    try {
        const { state, district } = req.query;
        let query = {};

        if (state) {
            query.State = { $regex: new RegExp(state, 'i') };
        }
        if (district) {
            query.District = { $regex: new RegExp(district, 'i') };
        }

        const crops = await CropPrice.find(query);

        if (!crops.length) {
            return res.status(404).json({ message: "No crops found matching the criteria" });
        }

        res.status(200).json(crops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
