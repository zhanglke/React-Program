import { Button } from 'antd';
import React from 'react';
import NewsPublish from './newsPublish';
import UsePublish from './usePublish';

function Sunset(props) {

    const {dataSource,handleDelete} = UsePublish(3)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button onClick={()=>handleDelete(id)}>删除</Button>}></NewsPublish>
        </div>
    );
}

export default Sunset;