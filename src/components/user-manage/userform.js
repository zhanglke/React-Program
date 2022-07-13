import React, { forwardRef,useEffect,useState } from 'react';
import {Form, Input,Select } from 'antd';
const {Option} = Select

const Userform = forwardRef((props,ref) =>{
    const [isDisable,setIsDisable] = useState(false)
    
    const {roleId} = JSON.parse(localStorage.getItem("token"))
    const roleObj = {
        "7":"superAdmin",
        "9":"regionEditor"
    }
    const checkRegionDisable = () =>{
        if(props.isUpdate){
            if(roleObj[roleId]==="superAdmin"){
                return false
            }else{
                return true
            }
        }else{

        }
    }
    useEffect(()=>{
        setIsDisable(props.isUpdateDisable)
    },[props.isUpdateDisable])
    return (
        <div>
            <Form ref={ref} layout="vertical">
                    <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                    <Input />
                    </Form.Item>
                    <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                    <Input />
                    </Form.Item>
                    <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisable?[{required:false}]:[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                    <Select  disabled={checkRegionDisable()} >
                        {props.regionList.map(data=>(
                            <Option value={data.value} key={data.id}>{data.title}</Option>
                        ))}
                    </Select>
                    </Form.Item>
                    <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                    <Select disabled={checkRegionDisable()} onChange={(value)=>{
                        console.log(value)
                        if(value===7){
                            setIsDisable(true)
                            ref.current.setFieldsValue({
                                region:""
                            })
                        }else{
                            setIsDisable(false)
                        }
                    }}>
                        {props.roleList.map(data=>(
                            <Option value={data.id} key={data.id}>{data.title}</Option>
                        ))}
                    </Select>
                    </Form.Item>
                    
                </Form>
        </div>
    );
})

export default Userform;