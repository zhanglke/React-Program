import React,{useState} from 'react';
import {Button,Tree} from 'antd'
import axios from 'axios'
function Home(props) {
    
    const ajax = () =>{
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
    }

    return (
        <div>
            home
            <Button type='primary' onClick={ajax}>Button</Button>

        </div>
    );
}

export default Home;