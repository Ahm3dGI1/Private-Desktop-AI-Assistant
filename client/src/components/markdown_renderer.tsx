import React from "react";
import ReactMarkdown from "react-markdown";
import { MathJaxContext, MathJax } from "better-react-mathjax";

interface MarkdownRenderProps {
    content: string;
}

const config = {
    loader: {
        load: ["[tex]/html"],
    },
    tex: {
        packages: { "[+]": ["html"] },
        inlineMath: [["$", "$"]],
        displayMath: [["$$", "$$"]],
        processEscapes: true,
        processEnvironments: true,
    },
    chtml: {
        scale: 1,
        mtextInheritFont: true,
    },
};

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ content }) => {
    return (
        <MathJaxContext config={config}>
            <div className="App">
                <MathJax dynamic hideUntilTypeset="every">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </MathJax>
            </div>
        </MathJaxContext>
    );
};

export default MarkdownRender;