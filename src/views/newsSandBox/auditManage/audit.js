import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Table,notification } from 'antd';
function Audit(props) {
    const [dataSource,setDataSource] = useState([])
    const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
        const roleObj = {
            "7":"superAdmin",
            "9":"regionEditor"
        }
        axios.get(`http://localhost:8000/news?auditState=1&_expand=category`).then(res=>{
            const list = res.data

            setDataSource(roleId===7?list:[
                //...list.filter(item=>item.author===username),
                ...list.filter(item=>item.region===region&&item.roleId&&roleObj[item.roleId]==="regionEditor")
            ])
            
        })
    },[roleId,region,username])

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
            title:"操作",
            render:(item)=>{
                return <div>
                    <Button type='primary' onClick={()=>handleAudit(item,2,1)}>通过</Button>
                    <Button danger onClick={()=>handleAudit(item,3,0)}>驳回</Button>
                    
                </div>
            }
        }
    ];

    const handleAudit = (item,auditState,publishState) =>{
        setDataSource(dataSource.filter(data=>data.id!==item.id))
        axios.patch(`http://localhost:8000/news/${item.id}`,{
            auditState,
            publishState
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您可以到【审核管理/审核列表】中查看您的新闻的审核状态}`,
                placement:"bottomRight",
                });
        })
    }

    return (
        <div>
            <Table rowKey={item=>item.id} dataSource={dataSource} columns={columns} pagination={{pageSize:5}} />
        </div>
    );
}

export default Audit;