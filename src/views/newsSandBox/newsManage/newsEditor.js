import React, { useEffect, useState } from 'react';
import {Editor, EditorState,convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

function NewsEditor(props) {

    useEffect(()=>{
        const html = props.content
        if(html===undefined) return
        const contentBlock = htmlToDraft(html)
        if(contentBlock){
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            setState(editorState)
        }

        console.log(props.content)
    },[props.content])

    const editorState = EditorState.createEmpty()
    const [state,setState] = useState(editorState)
    const onChange = (state) =>{
        setState(state);
    }

    return (
        <div className="editor" style={{background:"white"}} onBlur={()=>{
            //console.log(draftToHtml(convertToRaw(state.getCurrentContent())))
            props.getContent(draftToHtml(convertToRaw(state.getCurrentContent())))
        }}>
            <Editor editorState={state} onChange={onChange}/>
        </div>
    );
}

export default NewsEditor;