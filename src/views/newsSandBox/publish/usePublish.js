import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { notification } from 'antd';


function UsePublish(type) {
    const [dataSource,setDataSource] = useState([])
    const {username} = JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
        axios.get(`http://localhost:8000/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
            //console.log(res.data)
            setDataSource(res.data)
        })
    },[username,type])

    const handlePublish = (id) =>{
        //console.log("发布",id)
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`http://localhost:8000/news/${id}`,{
            "publishState":2,
            "publishTime": Date.now()
        }).then(res=>{
            //navigate("/publish-manage/published")

                notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已经发布】中查看您的新闻}`,
                placement:"bottomRight",
                });
        })
    }
    const handleDelete = (id) =>{
        //console.log('删除',id)
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.delete(`http://localhost:8000/news/${id}`).then(res=>{
            //navigate("/publish-manage/published")
                notification.info({
                message: `通知`,
                description:
                    `您已经删除了您已下线的新闻}`,
                placement:"bottomRight",
                });
        })
    }
    const handleSunset = (id) =>{
        //console.log('下线',id)
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`http://localhost:8000/news/${id}`,{
            "publishState":3,
        }).then(res=>{
            //navigate("/publish-manage/published")

                notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已经下线】中查看您的新闻}`,
                placement:"bottomRight",
                });
        })
    }


    return {dataSource,handleDelete,handlePublish,handleSunset};
}

export default UsePublish;