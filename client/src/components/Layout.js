import React, { useState } from 'react'
import "../Layout.css";
import {Link,Navigate,useLocation, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import {Badge} from 'antd'
function Layout({children}) {
                    const location=useLocation();
                    const navigate=useNavigate()
                     const [collapsed,setCollapsed] =useState(false);
                     const {user}= useSelector((state)=>state.user);
                     //user menu
                    const userMenu=[
                          {
                             name:"Home",
                             path:'/',
                             icon : "ri-home-line"
                          } ,
                          {
                             name:"Appointments",
                             path:'/appointments',
                             icon :  "ri-file-list-line"        
                          },
                           {
                                name:"Apply Doctor",
                                path:"/apply-doctor",
                                icon:"ri-hospital-line"
                           },                      
                    ];
                    //admin  menu
                    const adminMenu=[
                     {
                        name: "Home",
                        path: "/",
                        icon: "ri-home-line",
                      },
                      {
                        name: "Users",
                        path: "/admin/userslist",
                        icon: "ri-user-line",
                      },
                      {
                        name: "Doctors",
                        path: "/admin/doctorslist",
                        icon: "ri-user-star-line",
                      },
                      {
                        name: "Profile",
                        path: "/profile",
                        icon: "ri-user-line",
                      },        
                ];
                //doctor menu
                const doctorMenu = [
                  {
                    name: "Home",
                    path: "/",
                    icon: "ri-home-line",
                  },
                  {
                    name: "Appointments",
                    path: "/doctor/appointments",
                    icon: "ri-file-list-line",
                  },
                  {
                    name: "Profile",
                    path: `/doctor/profile/${user?._id}`,
                    icon: "ri-user-line",
                  },
                ];             
            
                
                const menuTobeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
                const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";

                return (
                    
 <div className="main">
   <div className="d-flex layout">
            <div className='sidebar'>
           <div className="sidebar-header">
              <h2 className='logo'>
                {!collapsed ? "DoctorHome": <i className="ri-hospital-fill menu-item2">DH</i>}
                </h2>
                <h1 className="role" key={role}>{role}</h1>
             </div>
            <div className="menu">
          {menuTobeRendered.map((menu)=>{
          const isActive=location.pathname===menu.path
          return <div className={`d-flex menu-item ${isActive&& 'active-menu-item'}`}>
               <i className={menu.icon} key={menu.icon}></i>
               {!collapsed && <Link to={menu.path} key={menu.name}>{menu.name}</Link> }
                      </div>      
            })}; 
            <div className={`d-flex menu-item  mt-2`} onClick={()=>{
              localStorage.clear()
              Navigate('/login')
            }}>
               <i className='ri-logout-circle-line ' ></i>
               {!collapsed && <Link to='/login' >Logout</Link> }
         </div> 
     </div>
 </div>
  <div className="content">
                            <div className="header">
                            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
  )}    
                   <div className="d-flex align-items-center px-4">
                   <Badge
                count={user?.unseenNotifications.length}
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>                    
              <Link className='anchor mx-2' to={'/profile'}>{user?.name}</Link>
  </div>
 </div>
                            <div className="body">
                              {children}
             </div>
    </div>
  </div>
  </div>
                    )

}

export default Layout