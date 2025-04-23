import mongoose from "mongoose";

const cropPriceSchema = new mongoose.Schema({
    State: String,
    District: String,
    Market: String,
    Commodity: String,
    Variety: String,
    Grade: String,
    Arrival_Date: String,
    "Min Price": Number,
    "Max Price": Number,
    "Modal Price": Number
});

const CropPrice = mongoose.model("CropPrice", cropPriceSchema);
export default CropPrice;
