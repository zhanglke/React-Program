import React, { useEffect, useState } from 'react';
import {Navigate,Route,Routes} from 'react-router-dom'
import Login from '../views/login/login';
import NewsSandBox from '../views/newsSandBox/newsSandBox';
import Home from '../views/newsSandBox/home/home';
import NotFound from '../notFound';
import RightList from '../views/newsSandBox/rightManage/rightList';
import RoleList from '../views/newsSandBox/rightManage/roleList';
import UserList from '../views/newsSandBox/userManage/userList';
import axios from 'axios';
import NewsWrite from '../views/newsSandBox/newsManage/newsWrite';
import Draft from '../views/newsSandBox/newsManage/draft';
import NewsPreview from '../views/newsSandBox/newsManage/newsPreview';
import NewsUpdate from '../views/newsSandBox/newsManage/newsUpdate';
import AuditList from '../views/newsSandBox/auditManage/auditList';
import Published from '../views/newsSandBox/publish/published';
import Audit from '../views/newsSandBox/auditManage/audit';
import Category from '../views/newsSandBox/newsManage/category';
import Unpublish from '../views/newsSandBox/publish/unpublish';
import Sunset from '../views/newsSandBox/publish/sunset';
import News from '../views/news/news';
import Details from '../views/news/details';
//import { Spin } from 'antd';
const localRouteMap = {
    "/home":<Home/>,
    "/user-manage/list":<UserList/>,
    "/right-manage/role/list":<RoleList/>,
    "/right-manage/right/list":<RightList/>,
    "/news-manage/write":<NewsWrite/>,
    "/news-manage/draft":<Draft/>,
    "/news-manage/category":<Category/>,
    "/audit-manage/audit":<Audit/>,
    "/audit-manage/list":<AuditList/>,
    "/news-manage/preview/:id":<NewsPreview/>,
    "/news-manage/update/:id":<NewsUpdate/>,
    "/publish-manage/unpublish":<Unpublish/>,
    "/publish-manage/published":<Published/>,
    "/publish-manage/sunset":<Sunset/>
}


function IndexRouter(props) {
    
    const [backRouteList,setBackRouteList] = useState([])
    useEffect(()=>{
        Promise.all([
            axios.get("http://localhost:8000/rights"),
            axios.get("http://localhost:8000/children"),
        ]).then(res=>{
            setBackRouteList([...res[0].data,...res[1].data])
        })        
    },[])
    
    var checkRoute = (item) =>{
        //console.log(item.routePermission)
        return localRouteMap[item.key] && (item.pagePermission || item.routePermission) 
    }

    var checkUserPermission = () =>{
        console.log(123)
    }
    


    var r = JSON.parse(localStorage.getItem("token"))
    // console.log(r)
    // var {role:{rights}} = JSON.parse(localStorage.getItem("token"))
    // var checkUserPermission = (item) =>{
    //     return rights.includes(item.key)
    // }
    if(r!==null) {
        var {role:{rights}} = JSON.parse(localStorage.getItem("token"))
        checkUserPermission = (item) =>{
            console.log("r!=null")
            return rights.includes(item.key)
        }
    }else{
        rights = "r=null"
        checkUserPermission = (item) =>{
            console.log(rights)
        }
    }

    // const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
    // const checkUserPermission = (item) =>{
    //     return rights.includes(item.key)
    // }

    return (
            
            <Routes>
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/news' element={<News/>}></Route>
                <Route path='/details/:id' element={<Details/>}></Route>
                <Route path='/' element={<AuthComponent>
                        <NewsSandBox/>
                    </AuthComponent>
                }>
                    {/* <Route path='news-manage/preview/1' element={<NewsPreview/>}></Route> */}
                    {/* 留插槽！ */}
                    {/* <Route index element={<Home/>}></Route>
                    <Route path='home' element={<Home/>}></Route>
                    <Route path='user-manage/list' element={<UserList/>}></Route>
                    <Route path='right-manage/role/list' element={<RoleList/>}></Route>
                    <Route path='right-manage/right/list' element={<RightList/>}></Route> */}
                    {backRouteList.map(data=>{
                        if(checkRoute(data) && checkUserPermission(data)){
                            return <Route path={data.key} key={data.key} element={localRouteMap[data.key]}></Route>
                        }else{ 
                            return null
                        }
                    })}
                </Route>

                <Route path='*' element={<NotFound/>}></Route>
                
            </Routes>

    );
}

export default IndexRouter;

const AuthComponent = ({children}) =>{
    const isLogin = localStorage.getItem("token")
    return isLogin?children:<Navigate to="/login"/>

}