import React from 'react';
import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import IndexRouter from './router/indexRouter'
import './App.css'
import {Provider} from 'react-redux'

import {store,persistStore_zhang} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'

function App() {
    useEffect(()=>{
        //axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E5%8C%97%E4%BA%AC&ci=1&channelId=4").then(res=>{console.log(res.data)})
    },[])
    
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore_zhang}>
            <HashRouter>
                <IndexRouter></IndexRouter>
            </HashRouter>
            </PersistGate>
        </Provider>
    );
    }

export default App;