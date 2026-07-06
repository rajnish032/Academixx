import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true,
  },
  authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  authorSnapshot: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    
    fullName: String,
    avatar: String,
  },
  text: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now, index: true },
});

CommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
