import express from "express";
import multer from "multer";
import uploadMedia, { validateMedia } from "../utils/multerForMedia.js";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getComments,
  getFeed,
  getPostLikes,
  getSinglePost,
  toggleLike,
  updatePost,
} from "../controllers/feed.controller.js";
import { userAuth } from "../middlewares/auth.js";
const feedRouter = express.Router();


feedRouter.post("/post", userAuth, uploadMedia.single("media"),validateMedia, createPost);
feedRouter.put("/post/:postId",userAuth,uploadMedia.single("media"),updatePost);
feedRouter.delete("/post/:postId", userAuth, deletePost);
feedRouter.post("/post/:postId/toggle-like", userAuth, toggleLike);
feedRouter.get("/post/:postId/likes",userAuth,getPostLikes);
feedRouter.get("/feed",userAuth, getFeed);
feedRouter.get("/post/:postId",userAuth, getSinglePost);

feedRouter.post("/post/:postId/comments", userAuth, addComment);

feedRouter.get("/post/:postId/comments", userAuth, getComments);

feedRouter.delete("/comments/:commentId",userAuth,deleteComment);


export default feedRouter;