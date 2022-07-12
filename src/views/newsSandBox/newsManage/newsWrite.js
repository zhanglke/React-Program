import React, { useEffect, useState,useRef } from 'react';
import { Button, PageHeader,Steps,Input,Form, Select, message,notification } from 'antd';
import style from './news.module.css'
import axios from 'axios';
import NewsEditor from './newsEditor';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid"


const {Option} = Select
const {Step} = Steps
function NewsWrite(props) {
    const [current,setCurrent] = useState(0)
    //console.log(current)
    const [categoryList,setCategoryList] = useState([])

    const navigate = useNavigate()
    const [formInfo,setFormInfo] = useState({})
    const [content,setContent] = useState("")
    const handleNext = () =>{
        if(current===0){
            NewsForm.current.validateFields().then(res=>{
                setFormInfo(res)
                setCurrent(current+1)
                //console.log(current)
            }).catch(error=>{
                console.log(error)
            })
        }else{
            if(content==="" || content==="<p></p>\n"){
                message.error("输入新闻内容")
            }else{
                console.log(formInfo,content)
                setCurrent(current+1)
            }
        }
    }
    const handlePrev = () =>{
        setCurrent(current-1)
        //console.log(current)
    }
    useEffect(()=>{
        axios.get("http://localhost:8000/categories").then(res=>{
        setCategoryList(res.data)
    })
    },[])

    const User = JSON.parse(localStorage.getItem("token"))
    const NewsForm = useRef(null)
    const handleSave = (auditState) =>{
        axios.post("http://localhost:8000/news",{
            ...formInfo,
            "content": content,
            "region": User.region?User.region:"全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            "key":uuidv4()
            //"publishTime": 0
        }).then(res=>{
            navigate(auditState===0?"/news-manage/draft":"/audit-manage/list")
                notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻}`,
                placement:"bottomRight",
                });
        })
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                onBack={() => null}
                title="撰写新闻"
                subTitle="This is a subtitle"
            />

            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

        <div style={{marginTop:"50px"}}>
            <div className={current===0?'':style.active}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off"
                ref={NewsForm}
                >
                
                <Form.Item
                    label="新闻标题"
                    name="title"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="新闻分类"
                    name="categoryId"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Select>
                        {categoryList.map(data=>(
                            <Option value={data.id} key={data.id}>{data.title}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            </div>
            <div className={current===1?'':style.active}>
                <NewsEditor getContent={(value)=>{
                    //console.log(value)
                    setContent(value)
                }}/>
            </div>
                <div className={current===2?'':style.active}>    
            </div>
        </div>

            <div style={{marginTop:"50px"}}>
                {
                    current ===2 && <span>
                        <Button type='primary' onClick={()=>handleSave(0)}>保存草稿</Button>
                        <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current<2 && <Button type='primary' onClick={handleNext}>下一步</Button>
                }
                {
                    current>0 && <Button onClick={handlePrev}>上一步</Button>
                }
            </div>
        </div>
    );
}

export default NewsWrite;