import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table,Button, Tag,notification } from 'antd';
import { useNavigate } from 'react-router-dom';

function AuditList(props) {
    const {username} = JSON.parse(localStorage.getItem("token"))
    const [dataSource,setDataSource] = useState([])
    useEffect(()=>{
        axios.get(`http://localhost:8000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(
            res=>{
                //console.log(res.data)
                setDataSource(res.data)
            }
        )
    },[username])

    const columns = [
        {
        title: '新闻标题',
        dataIndex: 'title',
        key: 'title',
        render: (title,item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>,
        },
        {
        title: '作者',
        dataIndex: 'author',
        key: 'title',
        },
        {
        title: '新闻分类',
        dataIndex: 'category',
        key: 'category',
        render:(category)=>{
            return <div>{category.title}</div>
        }
        },
        {
        title: '审核状态',
        dataIndex: 'auditState',
        key: 'auditState',
        render:(auditState)=>{
            const colorList = ["","orange","green","red"]
            const auditList = ["草稿箱","审核中","已通过","未通过"]
            return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
        }
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    {
                        item.auditState===1 && <Button onClick={()=>handleRevert(item)}>撤销</Button>
                    }{
                        item.auditState===2 && <Button danger onClick={()=>handlePublish(item)}>发布</Button>    
                    }{
                        item.auditState===3 && <Button type="primary" onClick={()=>handleUpdate(item)}>更新</Button>
                    }
                    
                </div>
            }
        }
    ];

    const handleRevert = (item) =>{
        setDataSource(dataSource.filter(data=>data.id!==item.id))
        axios.patch(`http://localhost:8000/news/${item.id}`,{
            auditState:0
        }).then(res=>{
                notification.info({
                message: `通知`,
                description:
                    `您可以到${'草稿箱'}中查看您的新闻}`,
                placement:"bottomRight",
                });
            
        })
    }

    const navigate = useNavigate()
    const handleUpdate = (item) =>{
        navigate(`/news-manage/update/${item.id}`)
    }

    //const params = useParams()
    const handlePublish = (item) =>{
        // const {id} = params
        axios.patch(`http://localhost:8000/news/${item.id}`,{
            "publishState":2,
            "publishTime": Date.now()
        }).then(res=>{
            navigate("/publish-manage/published")

                notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已经发布】中查看您的新闻}`,
                placement:"bottomRight",
                });
        })
    }
    return (
        <div>
            {/* AuditList */}
            <Table rowKey={item=>item.id} dataSource={dataSource} columns={columns} pagination={{pageSize:5}} />

        </div>
    );
}

export default AuditList;