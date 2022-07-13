import React from 'react';
import axios from 'axios'
import { Card, Col, Row, List } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import * as Echarts from 'echarts';
import { useRef } from 'react';
import _ from 'lodash'
import { Button, Drawer } from 'antd';

function Home(props) {
    const { Meta } = Card;
    // const ajax = () => {
    //取 get
    // axios.get("http://localhost:8000/posts/1").then(res=>{
    //     console.log(res.data)
    // })
    //增 post
    // axios.post("http://localhost:8000/post",{
    //     title:"0000",
    //     author:"li"
    // })

    //修改 替换 put
    // axios.put("http://localhost:8000/post/1",{
    //     title:"1111-修改"
    // })

    //更新
    // axios.patch("http://localhost:8000/post/1",{
    //     title:"1111-修改"
    // })

    //删除 delete 删除关联的POSTS和COMMENT
    // axios.delete("http://localhost:8000/posts/1")

    // _embed 向下关联
    // axios.get("http://localhost:8000/posts?_embed=comment").then(res=>{
    //     console.log(res.data)
    // })

    // _expand 向上关联
    // axios.get("http://localhost:8000/comment?_expand=post").then(res=>{
    //     console.log(res.data)
    // })
    const [viewList, setViewList] = useState([])
    const barRef = useRef()
    const pieRef = useRef()
    const [visible, setVisible] = useState(false)
    const [pieChart,setPieChart] = useState(null)
    const [allList,setAllList] = useState([])
    useEffect(() => {
        axios.get("http://localhost:8000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
            //console.log(res)
            setViewList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("http://localhost:8000/news?publishState=2&_expand=category").then(res => {
            //console.log(res.data)
            //console.log(_.groupBy(res.data,item=>item.category.title))
            renderBarView(_.groupBy(res.data, item => item.category.title))
            setAllList(res.data)
        })
        return () => {
            window.onresize = null
        }
    }, [])
    const renderBarView = (obj) => {
        var myChart = Echarts.init(barRef.current);
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "60",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => {
            //console.log("res")
            myChart.resize()
        }
    }
    const renderPieView = (obj) => {
        var currentList = allList.filter(item=>item.author===username)
        //console.log(currentList)
        var groupObj = _.groupBy(currentList,item=>item.category.title)
        //console.log(groupObj)
        var myChart
        var list = []
        for(var i in groupObj){
            list.push({
                name:i,
                value:groupObj[i].length
            })
        }
        console.log(list)
        if(!pieChart){
            myChart = Echarts.init(pieRef.current);
            setPieChart(myChart)
        }else{
            myChart = pieChart
        }
        
        var option;

        option = {
            title: {
                text: '当前用户新闻分类图示',
                //subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        option && myChart.setOption(option);
    }

    const [starList, setStarList] = useState([])
    useEffect(() => {
        axios.get("http://localhost:8000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
            //console.log(res)
            setStarList(res.data)
        })
    }, [])
    //}
    const { username, region, role: { title } } = JSON.parse(localStorage.getItem("token"))

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            //bordered
                            dataSource={viewList}
                            renderItem={item => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            //bordered
                            dataSource={starList}
                            renderItem={item => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {

                                setTimeout(() => {
                                    renderPieView()   
                                }, 0);
                                setVisible(true)
                                
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : "全球"}</b>
                                    <span style={{ paddingLeft: "30px" }}>{title}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer width="500px" title="个人新闻分类" placement="right" closable={true} onClose={() => {
                setVisible(false)
            }} visible={visible}>
                <div ref={pieRef} style={{ height: "400px", marginTop: "30px", width: "100%" }}></div>
            </Drawer>
            <div ref={barRef} style={{ height: "400px", marginTop: "30px", width: "100%" }}>

            </div>
        </div>
    );
}

export default Home;