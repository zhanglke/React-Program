import { Table, Button,Modal,notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined,UploadOutlined} from '@ant-design/icons' 
import { useNavigate } from 'react-router-dom';
const { confirm } = Modal;

function Draft(props) {
    const [dataSource,setDataSource] = useState([])
    const {username} = JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
        axios.get(`http://localhost:8000/news?author=${username}&auditState=0&_expand=category`).then(res=>{
            //console.log(123,res.data)
            const list = res.data
            setDataSource(list)
            // setDataSource(res.data)
        })
    },[username])

    const navigate = useNavigate()

    const columns = [
        {
            id:"ID",
            dataIndex:'id',
            key:'id',
            render:(title)=><b>{title}</b>
        },
        {
        title: '新闻标题',
        dataIndex: 'title',
        key:'title',
        render:(title,item)=>{
            return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
        }
        },
        {
            title: '作者',
            dataIndex: 'author',
            key:'author',
        },
        {
            title: '分类',
            dataIndex: 'category',
            render:(category)=>{
                return category.title
            }
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={()=>confirmMethord(item)}/>
                    
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
                        navigate(`/news-manage/update/${item.id}`)
                    }}/>
                
                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item.id)}/>
                
                
                </div>
            }
        }
    ];
    const handleCheck = (id) =>{
        axios.patch(`http://localhost:8000/news/${id}`,{
            auditState:1
        }).then(res=>{
            navigate("/audit-manage/list")
                notification.info({
                message: `通知`,
                description:
                    `您可以到${'审核列表'}中查看您的新闻}`,
                placement:"bottomRight",
                });
        })
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
        setDataSource(dataSource.filter(data=>data.id!==item.id))//1.前端删除
        axios.delete(`http://localhost:8000/news/${item.id}`)
        //2.后端删除 axios.delete 再把后端也删除，这样刷新页面就不会出现了    
    }
    

    return (
        <div>
            <Table  dataSource={dataSource} columns={columns} pagination={{pageSize:5}} 
            rowKey={item=>item.id}
            />




        </div>
    );
}

export default Draft;