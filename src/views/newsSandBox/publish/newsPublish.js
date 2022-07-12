import { Table, Tag, Button, Modal,Popover, Switch } from 'antd';

import React from 'react';

const { confirm } = Modal;
function NewsPublish(props) {
    
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            key: 'title',
            render:(title,item) =>{
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
        title: '新闻分类',
        dataIndex: 'category',
        render: (category)=>{
            return <div>{category.title}</div>
        }
        },
        {
            title:"操作",
            render:(item)=>{
                //console.log(item)
                return <div>
                    {props.button(item.id)}        
                </div>
            }
        }
    ];


    
    return (
        <div>
            
            <Table rowKey={item=>item.id} dataSource={props.dataSource} columns={columns} pagination={{pageSize:5}} />


        </div>
    );
}

export default NewsPublish;