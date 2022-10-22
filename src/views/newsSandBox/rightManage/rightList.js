import { Table, Tag, Button, Modal,Popover, Switch } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons' 

import {store} from '../../../redux/store';
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    //显示loading
    //console.log("加载数据")
    store.dispatch({
        type:"change_loading",
        payload:true
    })

    return config;
}, function (error) {
    // Do something with request error

    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    //隐藏loading
    
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return Promise.reject(error);
});



const { confirm } = Modal;
function RightList(props) {
    const [dataSource,setDataSource] = useState([])
    useEffect(()=>{
        axios.get("http://localhost:8000/rights?_embed=children").then(res=>{
            //console.log(123,res.data)
            setDataSource(res.data)
        })
    },[])

    const columns = [
        {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (id) => <b>{id}</b>,
        },
        {
        title: '权限名称',
        dataIndex: 'title',
        key: 'title',
        },
        {
        title: '权限路径',
        dataIndex: 'address',
        key: 'address',
        render:(title)=>{
            return <Tag color="blue">{title}</Tag>
        }
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={()=>confirmMethord(item)} />
                    <Popover content={<div style={{textAlign:"center"}}><Switch checked={item.pagePermission} onChange={()=>switchMethod(item)}/></div>} title="页面配置项" trigger={item.PagePermission?"":"click"}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagePermission===0}/>
                    </Popover>
                </div>
            }
        }
    ];

    const switchMethod = (item) =>{
        item.pagePermission = item.pagePermission===1?0:1
        console.log(item)
        setDataSource([...dataSource])
        if(item.grade===1){
            axios.patch(`http://localhost:8000/rights/${item.id}`,{
                pagePermission:item.pagePermission
            })
        }
        else{
            axios.patch(`http://localhost:8000/children/${item.id}`,{
                pagePermission:item.pagePermission
            })
        }
        //后端修改 axios.patch
        //此处未写，通过pagePermission来调控左侧侧边栏的显示与关闭，通过修改后端数据来改变,因此在
        //创建首页、用户管理等，应该使用pagePermission来调控，有值则创建，没有则不创建。但是在创建侧边栏
        //时写死了，后期应该改为动态模式
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
        console.log(item)
        if(item.grade===1){
            setDataSource(dataSource.filter(data=>data.id!==item.id))//1.前端删除
            axios.delete(`http://localhost:8000/rights/${item.id}`)
            //2.后端删除 axios.delete 再把后端也删除，这样刷新页面就不会出现了    
        }
        else{
            console.log(item.rightId)
            let list = dataSource.filter(data=>data.id===item.rightId)
            console.log(list)
            list[0].children = list[0].children.filter(data=>data.id!==item.id)
            setDataSource([...dataSource])
            axios.delete(`http://localhost:8000/children/${item.id}`)
            //删除后端数据
        }
    }
    
    return (
        <div>
            
            <Table  dataSource={dataSource} columns={columns} pagination={{pageSize:5}} />


        </div>
    );
}

export default RightList;