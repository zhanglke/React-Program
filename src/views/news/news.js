import React from 'react';
import { PageHeader,Col,Card,Row,List } from 'antd';
import { useEffect } from 'react';
import _ from 'lodash'
import axios from 'axios';
import { useState } from 'react';
function News(props) {
    
    const [list,setList] = useState([])
    useEffect(()=>{
        axios.get("http://localhost:8000/news?publishState=2&_expand=category").then(res => {
            //console.log(res.data)
            //console.log(Object.entries(_.groupBy(res.data,item=>item.category.title)))
            setList(Object.entries(_.groupBy(res.data,item=>item.category.title)))
            //console.log(l)
            
        })
    },[])

    return (
        <div style={{
            width:"95%",
            margin:"0 auto",
        }}>
            <PageHeader
                className="site-page-header"
                title="全球新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16,16]}>
                    {list.map(item=>
                        <Col span={8} key={item[0]}>
                        <Card title={item[0]} bordered={true} hoverable={true}>
                        <List
                            size="small"
                            dataSource={item[1]}
                            pagination={{
                                pageSize:3
                            }}
                            renderItem={data => <List.Item><a href={`#/details/${data.id}`}>{data.title}</a></List.Item>}
                        />
                        </Card>
                    </Col>
                    )}
                    
                    
                </Row>
                
            </div>
        </div>
    );
}

export default News;