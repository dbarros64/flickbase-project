import React, { useState, useEffect } from "react";


//wysiswyg
import { EditorState, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Edit
import htmlToDraft from 'html-to-draftjs';


const WYSISWYG = (props) => {
    const [editorData, setEditorData] = useState({
        editorState: EditorState.createEmpty()
    })

    const onEditorStateChange = (editorData) => {
        let HTMLdata = stateToHTML(editorData.getCurrentContent())
       
        setEditorData({
            editorState: editorData
        });

        props.setEditorState(HTMLdata)

    };


    // EDIT
    useEffect(() => {
        if (props.editContent) {
            const blockFromHtml = htmlToDraft(props.editContent);
            const { contentBlocks, entityMap} = blockFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

            setEditorData({
                editorState: EditorState.createWithContent(contentState)
            })
        }

    }, [props.editContent])



    return (
        <div>
            <Editor 
                editorState={editorData.editorState}
                onEditorStateChange={onEditorStateChange}
                wrapperClassName='demo-wrapper'
                editorClassName="demo-editor"
                onBlur={props.setEditorBlur}
            />
        </div>
    )
};


export default WYSISWYG;

