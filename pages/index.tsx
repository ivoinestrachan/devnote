import React, { useEffect, useState, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

export default function Home() {
  const [code, setCode] = useState('');
  const [currentLine, setCurrentLine] = useState(1);
  const codeDisplayRef = useRef<HTMLPreElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  useEffect(() => {
    updateCursorPosition();
  }, [currentLine]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const getLineNumbers = () => {
    const numberOfLines = code.split('\n').length;
    return Array.from({ length: numberOfLines }, (_, i) => i + 1).join('\n');
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop } = e.target as HTMLTextAreaElement;
    if (codeDisplayRef.current) {
      codeDisplayRef.current.scrollTop = scrollTop;
    }
  };

  const updateCursorPosition = () => {
    if (codeDisplayRef.current && cursorRef.current) {
      const lineHeight = parseFloat(getComputedStyle(codeDisplayRef.current).lineHeight);
      cursorRef.current.style.top = `${(currentLine - 1) * lineHeight}px`;
      cursorRef.current.style.height = `${lineHeight}px`;
    }
  };

  const handleCursorLineChange: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const lines = e.currentTarget.value.substr(0, e.currentTarget.selectionStart).split('\n');
    setCurrentLine(lines.length);
  };

  return (
    <div className="flex relative">
      <pre className="text-center select-none border-r border-gray-700 text-gray-500 font-mono h-[100vh] px-2">
        {getLineNumbers()}
      </pre>
      <div className="relative flex-1 flex">
        <textarea
          value={code}
          onChange={handleChange}
          onScroll={handleScroll}
          onKeyUp={handleCursorLineChange}
          autoComplete="off"
          spellCheck="false"
          className="code-input absolute top-0 left-0 w-full h-full z-10 bg-transparent resize-none outline-none font-mono text-white opacity-0"
        />
        <pre
          ref={codeDisplayRef}
          className="code-display absolute top-0 left-0 w-full h-full z-0 overflow-hidden font-mono bg-black text-white"
        >
          <code>{code}</code>
          <span ref={cursorRef} className="cursor"></span>
        </pre>
      </div>
      <style jsx>{`
        .line-numbers,
        .code-input,
        .code-display {
          line-height: 1.5;
          font-size: 16px;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background: black;
        }

        .cursor {
          position: absolute;
          width: 2px;
          background-color: white;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% {
            background-color: white;
          }
          50% {
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}
