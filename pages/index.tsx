import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/NavBar/Navbar";

type FilesType = { [key: string]: string };

export default function Home() {
  const [code, setCode] = useState("");
  const codeDisplayRef = useRef<HTMLPreElement>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const [files, setFiles] = useState<FilesType>({});
  const selectFile = (fileName: string) => {
    setActiveFile(fileName);
  };

  useEffect(() => {
    if (codeDisplayRef.current) {
      codeDisplayRef.current.innerHTML = convertMarkdownToHtml(code);
    }
  }, [code]);
  

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    setFiles((prev) => ({ ...prev, [activeFile as string]: newCode }));
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
    htmlText = htmlText.replace(/\*(.*?)\*/g, "<em>$1</em>");
    htmlText = htmlText.replace(/_(.*?)_/g, "<em>$1</em>");
    htmlText = htmlText.replace(/^- (.*?)(?=\n|$)/gm, "<li>$1</li>");

    return htmlText;
  };

  const createFile = (fileName: string) => {
    setFiles((prev) => ({ ...prev, [fileName]: "" }));
    setActiveFile(fileName);
  };

  useEffect(() => {
    if (activeFile) {
      setCode(files[activeFile]);
    }
  }, [activeFile, files]);

  return (
    <>
      <Navbar
        wrapText={wrapText}
        createFile={createFile}
        selectFile={selectFile}
        fileNames={Object.keys(files)}
        activeFile={activeFile}
      />

      {!activeFile && (
        <div className="text-white text-center mt-[350px] font-bold text-[24px]">
          Welcome To DevNote
        </div>
      )}

      {activeFile && (
        <div className="flex relative">
          <pre className="text-center select-none border-r border-gray-500 text-gray-500 font-mono h-[100vh] px-2">
            {getLineNumbers()}
          </pre>

          <div className="relative flex-1 flex">
            <textarea
              value={code}
              onChange={handleChange}
              onScroll={handleScroll}
              autoComplete="off"
              spellCheck="false"
              className="code-input w-[50%] h-full z-10 bg-transparent resize-none outline-none font-mono text-white"
            />
            
            {/* seperator and line number */}
            <div className="w-1 bg-gray-500" />
            <pre className="text-center select-none border-l border-gray-500 text-gray-500 font-mono h-[100vh] px-2">
              {getLineNumbers()}
            </pre>
            
            <pre
              ref={codeDisplayRef}
              className="code-display w-[50%] h-full z-0 overflow-hidden font-mono bg-black text-white flex"
            >
              <code>{code}</code>
              <div
                dangerouslySetInnerHTML={{
                  __html: convertMarkdownToHtml(code),
                }}
              />
            </pre>
          </div>
          
          <style jsx>{`
            .line-numbers,
            .code-input,
            .code-display {
              line-height: 1.5;
              box-sizing: border-box;
              background: black;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
