import { Layout, Menu } from 'antd';
// import {
//     UserOutlined,
//     VideoCameraOutlined,
//     UploadOutlined,
// } from '@ant-design/icons';
import './index.css'
import axios from 'axios'
//import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SubMenu from 'antd/lib/menu/SubMenu';
import MenuItem from 'antd/lib/menu/MenuItem';
import { connect } from 'react-redux';

const { Sider } = Layout;
function SideMenu(props) {
    const [menu,setMenu] = useState([])
    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
    //console.log("rights:",rights)
    useEffect(()=>{
        axios.get("http://localhost:8000/rights?_embed=children").then(res=>{
            const list = res.data
            list.forEach(data=>{
                if(data.children.length===0){
                    data.children=""
                }
            })
            setMenu(list)
        })
    },[])
    
    const checkPermission = (item) =>{
        return item.pagePermission && rights.includes(item.key) 
    }

    const navigate = useNavigate();
    const renderMenu = (menuList) =>{
        return(
            menuList.map(item=>{
                if(item.children?.length>0 && checkPermission(item)){
                    //console.log(item)
                    return <SubMenu key={item.id} title={item.title}>{renderMenu(item.children)}</SubMenu>
                }
                return checkPermission(item) && <MenuItem key={item.id} onClick={()=>{navigate(item.address)}}>{item.title}</MenuItem>
            })
        )
    }

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed} >
            <div style={{display:"flex",height:"100%",flexDirection:"column"}}>
            <div className="logo">发布系统</div>
                <div style={{flex:1, "overflow":"auto"}}>
                    <Menu theme='dark' mode='inline'>
                        {renderMenu(menu)}
                    </Menu>
                </div>);
            </div>
        </Sider>
    );
}

const mapStateToProps = ({collapsedReducer:{isCollapsed}}) =>({
    isCollapsed
})


export default connect(mapStateToProps)(SideMenu);