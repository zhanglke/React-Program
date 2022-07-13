import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,Form,Input, message } from 'antd';
import './login.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import MyParticles from './particles';
import axios from 'axios';


//import store from '../../store';

function Login(props) {

    //const userData = store.getState()
    //console.log(state)

    var navigate = useNavigate()
    var onFinish = (values) =>{
        //console.log(values)
        axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
            //console.log(123,res.data)
            if(res.data.length===0){
                message.error("用户名或密码不匹配")
            }else{
                localStorage.setItem("token",JSON.stringify(res.data[0]))
                //var {role:{rights}} = JSON.parse(localStorage.getItem("token"))
                //console.log(123,rights)
                //发送给indexRouter
                //userData = rights
                //console.log(userData)
                navigate("/home")
                //window.location.href = 'http://192.168.3.8:3000/#/home';
            }
        })
    }




    return (
        <div style={{height:"100%"}} > 
            <MyParticles/>
            <div className='formContainer'>
                
                <div className='loginTitle'>系统</div>
                
            <Form
                name="normal-login"
                className='login-form'
                onFinish={onFinish}
                labelCol={{
                    span: 4,}}

            >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input prefix={<UserOutlined/>} placeholder="Username"/>
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password prefix={<LockOutlined/>} placeholder="Password" className='site-form-item-icon'/>
            </Form.Item>

            {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 12 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 4, span: 12 }}>
                <Button type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>
            </Form>
            </div>
        </div>
    );
}

export default Login;