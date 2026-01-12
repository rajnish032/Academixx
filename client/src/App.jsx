import React, { useContext } from 'react';
import { Navigate, Route, Routes, useMatch } from 'react-router-dom';
import Home from './pages/student/Home.jsx';
import CoursesList from './pages/student/CourseList.jsx';
import CourseDetail from './pages/student/CourseDetail.jsx';
import MyEnrollment from './pages/student/MyEnrollement.jsx';
import Player from './pages/student/Player.jsx';
import Loading from './components/student/Loading.jsx';
import Educator from './pages/educator/Educator.jsx';
import Dashboard from './pages/educator/Dashboard.jsx';
import AddCourse from './pages/educator/AddCourse.jsx';
import MyCourses from './pages/educator/MyCourses.jsx';
import StudentsEnrolled from './pages/educator/StudentsEnrolled.jsx';
import Navbar from './components/student/Navbar.jsx';
import 'quill/dist/quill.snow.css';
import { ToastContainer } from 'react-toastify';

import { AppContext } from "./context/AppContext.jsx";
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/SignUp.jsx';


// Protects routes for logged-in users
const PrivateRoute = ({ children }) => {
  const { userData, authLoading } = useContext(AppContext);

  if (authLoading) return <div>Loading...</div>;
  return userData ? children : <Navigate to="/login" />;
};

// Protects educator-only routes
const EducatorRoute = ({ children }) => {
  const { userData, authLoading } = useContext(AppContext);

  if (authLoading) return <div>Loading...</div>;
  if (!userData) return <Navigate to="/login" />;
  if (userData.role !== "educator") return <Navigate to="/" />;

  return children;
};

const App = () => {

  const isEducatorRoute = useMatch('/educator/*')
  return (
    <div className=' text-default min-h-screen bg-white'>
      <ToastContainer />
      { !isEducatorRoute && <Navbar /> }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list/:input?" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/loading/:path" element={<Loading />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* <Route path="/my-enrollments" element={< MyEnrollment />} />
        <Route path="/player/:courseId" element={<Player />} /> */}
        
        <Route path="/my-enrollments" element={<PrivateRoute><MyEnrollment /></PrivateRoute> }/>
        <Route path="/player/:courseId" element={ <PrivateRoute> <Player /> </PrivateRoute>}/>
         

        <Route path="/educator" element={ <EducatorRoute> <Educator /> </EducatorRoute> }>

          {/* <Route path='/educator' element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} /> */}

          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        
        </Route>
      </Routes>
    </div>
  );
}

export default App;
