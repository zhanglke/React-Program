import { Table, Button, Modal,Form,Input} from 'antd';
import axios from 'axios';
import React, { useEffect, useState,useRef,useContext } from 'react';
import {DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons' 

    


const { confirm } = Modal;
function Category(props) {
    const [dataSource,setDataSource] = useState([])
    useEffect(()=>{
        axios.get("http://localhost:8000/categories").then(res=>{
            //console.log(123,res.data)
            setDataSource(res.data)
        })
    },[])

    const handleSave = (record) =>{
        setDataSource(dataSource.map(item=>{
            if(item.id===record.id){
                return{
                    id:item.id,
                    title:record.title,
                    value:record.title
                }
            }
            else{
                return item
            }
        }))
        axios.patch(`http://localhost:8000/categories/${record.id}`,{
            title:record.title,
            value:record.title
        })
        //console.log(record)
    }

    const columns = [
        {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (id) => <b>{id}</b>,
        },
        {
        title: '栏目名称',
        dataIndex: 'title',
        key: 'title',
        onCell: (record) => ({
            record,
            editable: true,
            dataIndex: 'title',
            title: '栏目名称',
            handleSave: handleSave,
        }),
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={()=>confirmMethord(item)} />
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
            axios.delete(`http://localhost:8000/categories/${item.id}`)
    }



    const EditableContext = React.createContext(null);

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
            </Form>
        );
        };
        
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
        }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
            inputRef.current.focus();
            }
        }, [editing]);
        
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
            [dataIndex]: record[dataIndex],
            });
        };
        
        const save = async () => {
            try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
            } catch (errInfo) {
            console.log('Save failed:', errInfo);
            }
        };
        
        let childNode = children;
        
        if (editable) {
            childNode = editing ? (
            <Form.Item
                style={{
                margin: 0,
                }}
                name={dataIndex}
                rules={[
                {
                    required: true,
                    message: `${title} is required.`,
                },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
            ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
            );
        }
        
        return <td {...restProps}>{childNode}</td>;
        };
    
    
    return (
        <div>
            新闻分类
            <Table rowKey={item=>item.id} dataSource={dataSource} 
            columns={columns} pagination={{pageSize:5}} 
            components={{
                body:{
                    row: EditableRow,
                    cell: EditableCell,
                },
            }}
            />


        </div>
    );
}


export default Category;