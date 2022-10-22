import React from 'react';
import { Outlet } from 'react-router-dom';
// import { HashRouter,Route,Routes } from 'react-router-dom';
import SideMenu from '../../components/sandBox/sideMenu';
import TopHeader from '../../components/sandBox/topHeader';
//import Home from './home/home';

import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import './newsSandBox.css'
import { Spin } from 'antd';
import { connect } from 'react-redux';
function NewsSandBox(props) {
    return ( 
        
    <Layout>
            <SideMenu></SideMenu>

            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Spin size="large" spinning={props.isLoading}>
                <Content
                    className="site-layout-background"
                    style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    overflow:"auto"
                    }}
                >
                    {/* Content内容区域 */}
                    <Outlet></Outlet>
                </Content>
                </Spin>
            </Layout>

    
    </Layout>
    );
}
const mapStateToProps = ({loadingReducer:{isLoading}}) =>({
    isLoading
})

export default connect(mapStateToProps)(NewsSandBox);