import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { useSelector } from 'react-redux'
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'
import ProctectedRoute from './components/ProctectedRoute'
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Notification from './pages/Notification';
import Userslist from './pages/Admin/Userslist';
import Doctorlist from './pages/Admin/Doctorlist'
import Profile from './pages/Doctor/Profile';
import Appointments from './pages/Appointments';
import BookingAppointment from './pages/BookingAppointment';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
const App = () => {
  const { loading } = useSelector(state => state.alerts)
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent ">
          <div class="spinner-border" role="status">
          </div>
        </div>)}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/Register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/' element={
          <ProctectedRoute>
            <Home />
            </ProctectedRoute>} />
            <Route path='/apply-doctor' element={
          <ProctectedRoute>
            <ApplyDoctor/>
            </ProctectedRoute>} />

            <Route path='/notifications' element={
          <ProctectedRoute>
            <Notification/>
            </ProctectedRoute>} />
            <Route
          path="/admin/userslist"
          element={
            <ProctectedRoute>
              <Userslist />
            </ProctectedRoute>
          }/>
          <Route
          path="/admin/doctorslist"
          element={
            <ProctectedRoute>
              <Doctorlist />
            </ProctectedRoute>
          }/>
            <Route
          path="/doctor/profile/:doctorId"
          element={
            <ProctectedRoute>
              <Profile />
            </ProctectedRoute>
          }/>
           
          <Route
          path="/book-appointment/:doctorId"
          element={
            <ProctectedRoute>
              <BookingAppointment />
            </ProctectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProctectedRoute>
              <Appointments />
            </ProctectedRoute>
          }
        />
          <Route
          path="/doctor/appointments"
          element={
            <ProctectedRoute>
              <DoctorAppointments />
            </ProctectedRoute>
          }
        />
     
      </Routes>
      
      
    </BrowserRouter>
  )
}

export default App