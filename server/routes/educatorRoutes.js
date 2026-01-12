import express from 'express';
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js';
import upload from '../utils/multer.js';
import { userAuth } from "../middlewares/auth.js";
import { protectEducator } from '../middlewares/protectEducator.js';

const educatorRouter = express.Router();

educatorRouter.post('/update-role',userAuth, updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), protectEducator,addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)

export default educatorRouter;