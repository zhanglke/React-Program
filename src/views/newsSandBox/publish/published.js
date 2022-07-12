import React from 'react';
import NewsPublish from './newsPublish';
import UsePublish from './usePublish';
import { Button } from 'antd';
function Published(props) {

    const {dataSource,handleSunset} = UsePublish(2)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button onClick={()=>handleSunset(id)}>下线</Button>} ></NewsPublish>
        </div>
    );
}

export default Published;