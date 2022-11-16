import {Form,Input,Button} from 'antd';
import {Link,useNavigate} from 'react-router-dom'
import {useDispatch}  from "react-redux"
import { hideLoading, showLoading } from "../redux/alertsSlice";

import React  from 'react'
import axios from "axios";
import  toast from "react-hot-toast";

const Register = (  ) => {
  const dispatch= useDispatch();
  const navigate=useNavigate();
  const onFinish=async(values) =>{
    // console.warn(values.password);
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      // console.log(error.response.data);
      toast.error("Something went wrong");
    }
  };

  return (

  <div className='authentiction'>
<div className='authentiction-form card p-2'>
  <h1 className='card-title'>Nice To Meet You</h1>
  <Form layout='vertical' onFinish={onFinish}>

    <Form.Item required label='Name' name='name'>
      <Input placeholder='Enter your Name' type='text' autoComplete='on'/>
    </Form.Item>

    <Form.Item required label='Email' name='email'>
      <Input placeholder='Email'  type='email' autoComplete='on'/>
    </Form.Item>

    <Form.Item required label='Password' name='password' >
      <Input placeholder=' Password'   type='password' autoComplete='off'/>
    </Form.Item>

    {/* <Form.Item label='ConfirmPassword' name='CPassword' >
      <Input placeholder=' ConfirmPassword' type='password' autoComplete='off'/>
    </Form.Item> */}
<Button className='primary-button my-2 full-width-button' htmlType='submit'>Register</Button>
  <Link to="/login" className='anchor'>CLICK HERE TO LOGIN</Link>
  </Form>
</div>
  </div>
  )
}

export default Register;