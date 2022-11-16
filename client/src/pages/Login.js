import React from 'react';
import{Form,Input,Button} from 'antd';
import {Link,useNavigate} from 'react-router-dom';
import axios from "axios";
import  toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useDispatch } from 'react-redux';

const Login = () => {
  const dispatch= useDispatch();
  const navigate=useNavigate();
    const onFinish= async(creditionals) =>{
   
    try {
      dispatch(showLoading()); 
      const response = await axios.post("/api/user/login", creditionals);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        // toast("Redirecting to Home Page");
        localStorage.setItem("token",response.data.data);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error.response.data);
      toast.error("Something went wrong");
    }
     
   } 
  
  return (
    <div className='authentiction'>
    <div className='authentiction-form card p-2'>
      <h1 className='card-title'>Login</h1>
      <Form layout='vertical' onFinish={onFinish} >
    
        <Form.Item required label='Email' name='email'>
          <Input placeholder='Email'  type='email' autoComplete='on'/>
        </Form.Item>
    
        <Form.Item required label='Password' name='password' >
          <Input placeholder=' Password'   type='password' autoComplete='off'/>
        </Form.Item>
    
        
        <Button className='primary-button my-2  full-width-button' htmlType='submit' >Login</Button>
    <Link to="/register" className='anchor'>CLICK HERE TO REGISTER</Link>
        
    

      </Form>
    </div>
      </div>
  )
}

export default Login