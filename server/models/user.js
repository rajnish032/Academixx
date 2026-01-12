// import express from 'express';
// import mongoose from 'mongoose';

// const userSChema = new mongoose.Schema(
//     {
//         _id: {
//             type: String,
//             required: true,
//         },
//         name: {
//             type: String,
//             required: true,
//         },
//         email: {
//             type: String,
//             required: true,

//         },

//         imageUrl: {
//             type:String,
//             required: true
//         },
//         enrolledCourses: [
//             {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Course'
//             },

//         ],


//     },
//     {timestamps:true}
// )

//     const User = mongoose.model('User', userSChema);

//     export default User;

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "educator", "admin"],
      default: "student",
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

/* ================= JWT ================= */
userSchema.methods.getJWT = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
};

/* ================= PASSWORD CHECK ================= */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
