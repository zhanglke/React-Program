import React, { useEffect, useState } from 'react';
import { Descriptions,PageHeader } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment'
import {HeartTwoTone} from '@ant-design/icons'
function Details(props) {
    const params = useParams()
    const [newsInfo,setNewsInfo] = useState()
    useEffect(()=>{
        const {id} = params
        axios.get(`http://localhost:8000/news/${id}?_expand=category&_expand=role`).then(res=>{
            //console.log(res.data)
            setNewsInfo({
                ...res.data,
                //view:res.data.view+1
            })
            //console.log(123)
            return res.data
        }).then(res=>{
            axios.patch(`http://localhost:8000/news/${id}`,{
                view: res.view + 1
            })
        })
        
    },[params])

    const auditList = ["未审核","审核中","已通过","未通过"]
    const publishList = ["未发布","待发布","已发布","已下线"]
    const colorList = ["black","orange","green","red"]
    const handleStar = () =>{
        setNewsInfo({
            ...newsInfo,
            star:newsInfo.star+1
        })
        const {id} = params
        axios.patch(`http://localhost:8000/news/${id}`,{
                star: newsInfo.star + 1
            })
    }
    return (
        <div>
            {newsInfo && 
            <div>
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={<div>{newsInfo.category.title}
                            <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()}/>
                            
                </div>}
                >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                    
                </Descriptions>
                </PageHeader>
            <div dangerouslySetInnerHTML={{
                __html:newsInfo.content
            }} style={
                {margin:"0 24px", border:"1px solid gray"}}>
            </div>
            </div>}    
                

        
        </div>
    );
}

export default Details;