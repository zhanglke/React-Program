import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NewsPublish from './newsPublish';
import UsePublish from './usePublish';
import { Button } from 'antd';

function Unpublish(props) {

    const {dataSource,handlePublish} = UsePublish(1)
    return (
        <div>
            <NewsPublish dataSource={dataSource} 
            button={
                (id)=><Button type='primary' onClick={()=>handlePublish(id)}>发布</Button>
            }>

            </NewsPublish>
        </div>
    );
}

export default Unpublish;