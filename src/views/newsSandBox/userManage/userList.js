import { Table, Button, Modal, Switch, } from 'antd';
import axios from 'axios';
import React, { useEffect, useState,useRef } from 'react';
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons' 
import Userform from '../../../components/user-manage/userform';
import { v4 as uuidv4 } from "uuid"
const { confirm } = Modal;
function UserList(props) {
    const [dataSource,setDataSource] = useState([])
    const [isAddVisible,setIsAddVisible] = useState(false)
    const [roleList,setRoleList] = useState([])
    const [regionList,setRegionList] = useState([])
    const addForm = useRef(null)
    const [isUpdateVisible,setIsUpdateVisible] = useState(false)
    const updateForm = useRef(null)
    const [isUpdateDisable,setIsUpdateDisable] = useState(false)
    const [current,setCurrent] = useState(null)

    const {roleId,region} = JSON.parse(localStorage.getItem("token"))

    useEffect(()=>{

        axios.get("http://localhost:8000/users?_expand=role").then(res=>{
            const list = res.data
            const roleObj = {
                "7":"superAdmin",
                "9":"regionEditor"
            }
            setDataSource(roleId===7?list:[
                // ...list.filter(item=>item.username===username),
                ...list.filter(item=>item.region===region&&item.roleId&&roleObj[item.roleId]==="regionEditor")
            ])
        })
    },[roleId,region])
    const columns = [
        {
        title: '区域',
        dataIndex: 'region',
        filters:[...regionList.map(item=>({
            text:item.title,
            value:item.value
        })),{
            text:"全球",
            value:"全球"
        }],

        onFilter:(value,item)=>{if(value==="全球"){
            return item.region===""
        }
        return value
        },

        render: (region) => <b>{region===""?"全球":region}</b>,
        },
        {
        title: '角色名称',
        dataIndex: 'role',
        render:(role)=>{
            //console.log(role)
            return role?.title
        }
        },
        {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        render:(username)=>{
            return <b>{username}</b>
        }
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            key: 'roleState',
            render:(roleState,item)=>{
                return <Switch onChange={()=>handleChange(item)} checked={roleState} disabled={item.default}></Switch>
            }
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} 
                    onClick={()=>confirmMethord(item)}  disabled={item.default}/>
                    <Button type="primary" shape="circle" icon={<EditOutlined />} 
                        disabled={item.default} onClick={()=>handleUpdate(item)}/>
                    
                </div>
            }
        }
    ];


    useEffect(()=>{
        axios.get("http://localhost:8000/regions").then(res=>{
            setRegionList(res.data)
            //console.log(regionList)
        })
    },[])
    useEffect(()=>{
        axios.get("http://localhost:8000/roles").then(res=>{
            setRoleList(res.data)
        })
    },[])

    const handleChange = (item) =>{
        //console.log(item)
        item.roleState = !item.roleState
        //console.log(dataSource)
        setDataSource([...dataSource])
        axios.patch(`http://localhost:8000/users/${item.id}`,{
            roleState:item.roleState
        })
    }

    const updateFormOk = () =>{
        setIsUpdateVisible(false)
        updateForm.current.validateFields().then(value=>{
            setIsUpdateDisable(false)
            setDataSource(dataSource.map(item=>{
                if(item.id===current.id){
                    return{
                        ...item,
                        ...value,
                        role:roleList.filter(data=>data.id===value.roleId)[0]
                    }
                }
                return item
            }))
            axios.patch(`http://localhost:8000/users/${current.id}`,value)
        })
    }

    const handleUpdate = (item) =>{
        //console.log("1")
        setIsUpdateVisible(true)
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        setTimeout(() => {
            if(item.roleId===7){
                setIsUpdateDisable(true)
            }
            else{
                setIsUpdateDisable(false)
            }
            //console.log("2")
            updateForm.current.setFieldsValue(item)
            //console.log("3")            
        }, 0);
        setCurrent(item)
        }

    

    const confirmMethord = (item) =>{
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    }

    const deleteMethod = (item) =>{
        //console.log(item)
            setDataSource(dataSource.filter(data=>data.id!==item.id))//1.前端删除
            axios.delete(`http://localhost:8000/users/${item.id}`)
            //2.后端删除 axios.delete 再把后端也删除，这样刷新页面就不会出现了    
    }
    
    const addFormOk = () =>{
        //console.log("add")
        addForm.current.validateFields().then(value=>{
            //console.log(value)
            setIsAddVisible(false)
            addForm.current.resetFields()
            //先post到后端生成ID
            axios.post(`http://localhost:8000/users`,{
                ...value,
                "roleState": true,
                "default": false,
                "key":uuidv4()
            }).then(res=>{
                console.log(123,res.data)
                setDataSource([...dataSource,{
                    ...res.data,
                    role:roleList.filter(todo=>todo.id===value.roleId)[0]
                }])
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <div>
            
            <Button type="primary" onClick={()=>{
                setIsAddVisible(true)
            }} >添加用户</Button>
            <Table  dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={item=>item.key} />
            
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={()=>{
                    setIsAddVisible(false)

                }}
                onOk={() => addFormOk()}
            >
                <Userform ref={addForm} regionList={regionList} roleList={roleList}/>
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={()=>{
                    setIsUpdateVisible(false)
                    setIsUpdateDisable(!isUpdateDisable)
                }}
                onOk={() => updateFormOk()}
            >
                <Userform ref={updateForm} regionList={regionList} roleList={roleList} 
                isUpdateDisable={isUpdateDisable} isUpdate={true}/>
            </Modal>
        </div>
    );
}

export default UserList;