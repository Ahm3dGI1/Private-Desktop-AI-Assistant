import React from "react";
import ReactMarkdown from "react-markdown";
import { MathJaxContext, MathJax } from "better-react-mathjax";

interface MarkdownRenderProps {
    content: string;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ content }) => {
    return (
        <MathJaxContext>
            <div className="App">
                <MathJax dynamic hideUntilTypeset="every">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </MathJax>
            </div>
        </MathJaxContext>
    );
};

export default MarkdownRender;
