import React from 'react';
import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import IndexRouter from './router/indexRouter'
import './App.css'
import {Provider} from 'react-redux'
import store from './redux/store'

function App() {

    useEffect(()=>{
        //axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E5%8C%97%E4%BA%AC&ci=1&channelId=4").then(res=>{console.log(res.data)})
    },[])


    
    return (
        <Provider store={store}>
            <HashRouter>
                <IndexRouter></IndexRouter>
            </HashRouter>
        </Provider>
    );
    }

export default App;