import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/NavBar/Navbar";

export default function Home() {
  const [code, setCode] = useState("");
  const codeDisplayRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeDisplayRef.current) {
      codeDisplayRef.current.innerHTML = convertMarkdownToHtml(code);
    }
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const getLineNumbers = () => {
    const numberOfLines = code.split("\n").length;
    return Array.from({ length: numberOfLines }, (_, i) => i + 1).join("\n");
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop } = e.target as HTMLTextAreaElement;
    if (codeDisplayRef.current) {
      codeDisplayRef.current.scrollTop = scrollTop;
    }
  };

  const wrapText = (wrapper: any) => {
    const textarea = document.querySelector(
      ".code-input"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);

    if (start !== end) {
      const newText = `${textarea.value.slice(
        0,
        start
      )}${wrapper}${selectedText}${wrapper}${textarea.value.slice(end)}`;
      setCode(newText);

      setTimeout(() => {
        textarea.selectionStart = start + wrapper.length;
        textarea.selectionEnd = end + wrapper.length;
      }, 0);
    }
  };

 

  const convertMarkdownToHtml = (markdownText: any) => {
    let htmlText = markdownText;
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return htmlText;
  };

  return (
    <>
      <Navbar wrapText={wrapText}/>
      <div className="flex ">
        <pre className="text-center select-none border-r border-gray-700 text-gray-500 font-mono h-[100vh] px-2">
          {getLineNumbers()}
        </pre>
        <div className="relative flex-1 flex">
          <textarea
            value={code}
            onChange={handleChange}
            onScroll={handleScroll}
            autoComplete="off"
            spellCheck="false"
            className="code-input absolute top-0 left-0 w-full h-full z-10 bg-transparent resize-none outline-none font-mono text-white opacity-0"
          />

          <pre
            ref={codeDisplayRef}
            className="code-display absolute top-0 left-0 w-full h-full z-0 overflow-hidden font-mono bg-black text-white flex"
          >
            <code>{code}</code>

            <div
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(code) }}
            />
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
        `}</style>
      </div>
    </>
  );
}
