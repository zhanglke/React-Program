import { Table, Button,Modal,Tree } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons' 
const { confirm } = Modal;

function RoleList(props) {
    const [dataSource,setDataSource] = useState([])
    const [isModalVisible,setisModalVisible] = useState(false)
    const [rightList,setRightList] = useState([])
    const [currentRights,setCurrentRights] = useState([])
    const [currentID,setCurrentID] = useState(0)
    useEffect(()=>{
        axios.get("http://localhost:8000/roles?_embed=children").then(res=>{
            //console.log(123,res.data)
            const list = res.data
            list.forEach(item=>{
                if(item.children.length === 0){
                    item.children = ""
                }
            })
            setDataSource(list)
            // setDataSource(res.data)
        })
    },[])
    useEffect(()=>{
        axios.get("http://localhost:8000/rights?_embed=children").then(res=>{
            //console.log(123,res.data)
            setRightList(res.data)
        })
    },[])
    const columns = [
        {
            id:"ID",
            dataIndex:'id',
            key:'id',
            render:(title)=><a>{title}</a>
        },
        {
        title: '角色名称',
        dataIndex: 'title',
        key: 'title',
        render: (title) => <b>{title}</b>,
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={()=>confirmMethord(item)}/>
                    
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
                        setisModalVisible(true)
                        setCurrentRights(item.rights)
                        setCurrentID(item.id)
                        //console.log(123,item.rights)
                        //console.log(456,currentRights)
            }}/>
                </div>
            }
        }
    ];
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
        axios.delete(`http://localhost:8000/roles/${item.id}`)
        //2.后端删除 axios.delete 再把后端也删除，这样刷新页面就不会出现了    
    }
    const handleOk = ()=>{
        console.log(currentRights)
        setisModalVisible(false)
        //同步datasource
        setDataSource(dataSource.map(item=>{
            if(item.id===currentID){
                return{
                    ...item,
                    rights:currentRights
                }
            }
            return item
        }))
        axios.patch(`http://localhost:8000/roles/${currentID}`,{
            rights:currentRights
        })
        //
    }
    const handleCancel = () =>{
        setisModalVisible(false)
    }

        const [expandedKeys, setExpandedKeys] = useState([]);
        //const [checkedKeys, setCheckedKeys] = useState([]);
        const [selectedKeys, setSelectedKeys] = useState([]);
        const [autoExpandParent, setAutoExpandParent] = useState(true);
    
        const onExpand = (expandedKeysValue) => {
        //console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
    
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
        };
    
        const onCheck = (checkedKeysValue) => {
        //console.log('onCheck', checkedKeysValue);
        setCurrentRights(checkedKeysValue);
        };
    
        const onSelect = (selectedKeysValue, info) => {
        //console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
        };

    return (
        <div>
            RoleList
            <Table  dataSource={dataSource} columns={columns} pagination={{pageSize:5}} />

            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={rightList}
                checkedKeys={currentRights}
                />
            </Modal>


        </div>
    );
}

export default RoleList;