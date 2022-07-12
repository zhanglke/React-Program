import React from 'react';
//import { Layout } from 'antd';
import { Dropdown,Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect} from 'react-redux';

import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function TopHeader(props) {
    
    //console.log(props);

    // const [collapsed,setCollapsed] = useState(false)
    const changeCollapsed = () =>{
        props.changeCollapsed()
    }

    const navigate = useNavigate()
    const {role:{title},username} = JSON.parse(localStorage.getItem("token"))
    const menu = (
        <Menu >
            <Menu.Item key={title}>
                {title}
            </Menu.Item>
            <Menu.Item danger key={username} onClick={()=>{
                localStorage.removeItem("token")
                navigate("/login")
            }}>
                退出
            </Menu.Item>
        </Menu>
    );

    return (
        
        <Header className="site-layout-background" style={{ padding: "0,8px" }}>
            {props.isCollapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>:<MenuFoldOutlined onClick={changeCollapsed}/>}
        
        <div style={{float:"right"}}>
            <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
            <Dropdown overlay={menu}>
                <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
        </div>
        
        </Header>

    ); 
}

const mapStateToProps = ({collapsedReducer:{isCollapsed}}) =>{
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed(){
        return{
            type:"change_collapsed",

        }
    }
}
//
export default connect(mapStateToProps,mapDispatchToProps)(TopHeader);