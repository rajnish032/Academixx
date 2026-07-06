import mongoose from "mongoose";
const { Schema } = mongoose;

const PostSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  authorSnapshot: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fullName: String,
    avatar: String,
  },
  text: { type: String, maxlength: 1000 },
  mediaUrl: { type: String },
  mediaType: { type: String },
  likesCount: { type: Number, default: 0, min: 0 },
  commentsCount: { type: Number, default: 0, min: 0 },
  tag: {
    type: String,
    enum: ["general", "streak", "other", "public"],
    required: true,
    default: "public",
  },
  createdAt: { type: Date, default: Date.now, index: true },
});

PostSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", PostSchema);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);