import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'

function Register(props) {

    const username = useRef()
    const password = useRef()
    const email = useRef()
    const birth = useRef()
    const phone = useRef()
    const right = useRef()
    
    const navigate = useNavigate()

    const register = () =>{
        //console.log(username.current.value + '\n' + password.current.value)
        //发送信息给后端
        axios({
            method:'POST',
            url:'/users',
            params:{
                username:username.current.value,
                password:password.current.value,
                right:right.current.value
            }
        }).then((res)=>{
            console.log(res)
            console.log({username:username.current.value,
                password:password.current.value,
                right:right.current.value})
        })

        navigate("/login")
    }

    return (
        <div className='bg'>
            <div className='a'>
                <div className='b'style={{height:'550px'}}>
                    <div className='c'>注册界面</div>
                    <div className='insert' style={{height:'400px'}}>
                        <input type="text" className='e' placeholder='请输入用户名' ref={username}/>
                        <input type="password" className='e' placeholder='请输入密码' ref={password}/>
                        <input type="text" className='e' placeholder='请输入邮箱' ref={email}/>
                        <input type="text" className='e' placeholder='请输入生日' ref={birth}/>
                        <input type="text" className='e' placeholder='请输入电话' ref={phone}/>
                        <input type="text" className='e' placeholder='请输入权限' ref={right}/>
                    </div>

                    <div style={{display:'flex'}}>
                        <div style={{textAlign:'start',width:'50%'}}>
                            <button className='btn' onClick={()=>{navigate("/login")}}>返回</button>
                        </div>
                        <div style={{textAlign:'end',width:'50%'}}>
                            <button className='btn' onClick={register} >注册</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;