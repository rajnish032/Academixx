import mongoose from "mongoose";
const { Schema } = mongoose;

const ReactionSchema = new Schema({
  targetType: { type: String, enum: ["Post"], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

ReactionSchema.index(
  { targetType: 1, targetId: 1, userId: 1 },
  { unique: true }
);

export default mongoose.models.Reaction || mongoose.model("Reaction", ReactionSchema);