import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  message: { type: String, required: true },
});

export default mongoose.model("Test", testSchema);
