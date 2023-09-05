import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

function MarkupRenderer({termsFile}){
    const [markdown, setMarkdown] = useState('');
    useEffect(() => {
        fetch(termsFile).then(response => {
            return response.text()
          })
          .then(text => {
            setMarkdown(text)
          })
    },[termsFile])
    return (
        <>
            <ReactMarkdown components={ChakraUIRenderer()} children={markdown} skipHtml />
        </>
    )
}
export default MarkupRenderer;