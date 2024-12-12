// FILE: CodeBlock.js
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';


const CodeBlock = ({ code }) => {
    return (
        <div className="code-block">
            <pre>{code}</pre>
            <CopyToClipboard text={code}>
                <button className="copy-button"><FaCopy /> Copy</button>
            </CopyToClipboard>
        </div>
    );
};

export default CodeBlock;