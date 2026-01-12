import express from 'express'
import { getUserData, purchaseCourse, userEnrolledCourses,updateUserCourseProgress, getUserCourseProgress, addUserRating } from '../controllers/user.js'
import { userAuth } from "../middlewares/auth.js";
const userRouter = express.Router()


/* All routes below require login */
userRouter.use(userAuth);
userRouter.get('/data',  getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)


userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)


export default userRouter;