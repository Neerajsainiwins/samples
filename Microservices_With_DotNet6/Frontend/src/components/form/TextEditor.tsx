import React, { Component } from 'react';
import { Editor } from "react-draft-wysiwyg";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { useEffect, useMemo, useState } from "react";


interface TextEditorProps {
  value?: any;
}
const TextEditor = ({value}: TextEditorProps) => {


  var editorState = EditorState.createEmpty()
  const [description, setDescription] = React.useState(editorState);

  const setEditorState = (editorState: any) => {
    setDescription(editorState)
  }
  return (
    <div className='wrapperTextEditior'>
      <Editor
        editorState={description}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        onEditorStateChange={setEditorState}

      />
    </div>
  );
};

export default TextEditor;

