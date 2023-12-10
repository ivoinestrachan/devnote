import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/NavBar/Navbar";

type FilesType = { [key: string]: string };

export default function Home() {
  const [code, setCode] = useState("");
  const codeDisplayRef = useRef<HTMLPreElement>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isSplitScreen, setIsSplitScreen] = useState<boolean>(false);

  const [files, setFiles] = useState<FilesType>({});
  const selectFile = (fileName: string) => {
    setActiveFile(fileName);
  };

  const syntaxHighlightingRules = {
    "python": {
      "keywords": ["def", "return", "if", "else", "for", "while", "break", "continue", "import", "from", "as", "print"],
      "color": "blue",
      "brackets": ["(", ")"],
      "bracketsColor": "magenta"
    },
    "javascript": {
      "keywords": ["function", "return", "if", "else", "for", "while", "break", "continue", "import", "export", "from", "const", "let", "var", "=", "async", "string", "options", "data", "as", "await"],
      "color": "red",
      "brackets": ["{", "}", "(", ")", "[", "]"],
      "bracketsColor": "orange"
    },
    "html": {
      "tags": ["<!DOCTYPE html>", "<html>", "</html>", "<head>", "</head>", "<body>", "</body>", "<div>", "</div>", "<span>", "</span>", "<p>", "</p>", "<a>", "</a>", "<ul>", "</ul>", "<li>", "</li>", "<h1>", "</h1>", "<h2>", "</h2>", "<h3>", "</h3>", "<h4>", "</h4>", "<h5>", "</h5>", "<h6>", "</h6>", "<br>", "<hr>", "<img>", "<src>"],
      "color": "brown",
      "attributes": ["href", "src", "id", "class", "alt", "title", "style"],
      "attributesColor": "red"
    }
  };
  
  

  useEffect(() => {
    if (codeDisplayRef.current) {
      //@ts-ignore
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

  const convertMarkdownToHtml = (markdownText: string, language: string | number | undefined) => {
    let htmlText = markdownText;
  
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    htmlText = htmlText.replace(/\*(.*?)\*/g, "<em>$1</em>");
    htmlText = htmlText.replace(/_(.*?)_/g, "<em>$1</em>");
    htmlText = htmlText.replace(/^- (.*?)(?=\n|$)/gm, "<li>$1</li>");
  
 //@ts-ignore
 const rules = syntaxHighlightingRules[language];
 if (rules) {
   
   rules.keywords?.forEach((keyword: any) => {
     const regex = new RegExp(`\\b${keyword}\\b`, 'g');
     htmlText = htmlText.replace(regex, `<span style='color: ${rules.color};'>${keyword}</span>`);
   });

   rules.brackets?.forEach((bracket: string) => {
     const escapedBracket = bracket.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     const regex = new RegExp(escapedBracket, 'g');
     htmlText = htmlText.replace(regex, `<span style='color: ${rules.bracketsColor};'>${bracket}</span>`);
   });

   if (language === 'html') {
     rules.tags?.forEach((tag: string) => {
       const regex = new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
       htmlText = htmlText.replace(regex, `<span style='color: ${rules.color};'>${tag}</span>`);
     });
     rules.attributes?.forEach((attribute: any) => {
       const regex = new RegExp(`\\b${attribute}\\b`, 'g');
       htmlText = htmlText.replace(regex, `<span style='color: ${rules.attributesColor};'>${attribute}</span>`);
     });
   }
 }
  
    return htmlText;
  };

  const getLanguageFromFileName = (fileName: string | null) => {
    if (fileName?.endsWith('.py')) {
      return 'python';
    } else if (fileName?.endsWith('')) {
      return 'javascript';
    }
    return null;
  };
  
  
  useEffect(() => {
    if (codeDisplayRef.current) {
      const language = getLanguageFromFileName(activeFile);
      codeDisplayRef.current.innerHTML = convertMarkdownToHtml(code, language || "");
    }
  }, [code, activeFile]);
  

  const createFile = (fileName: string) => {
    setFiles((prev) => ({ ...prev, [fileName]: "" }));
    setActiveFile(fileName);
  };

  useEffect(() => {
    if (activeFile) {
      setCode(files[activeFile]);
    }
  }, [activeFile, files]);

  const handleSplitScreen = () => {
    setIsSplitScreen(!isSplitScreen);
  };

  return (
    <>
      <Navbar
        wrapText={wrapText}
        createFile={createFile}
        selectFile={selectFile}
        fileNames={Object.keys(files)}
        activeFile={activeFile}
        splitScreen={handleSplitScreen}
      />

      {!activeFile && (
        <div className="text-white text-center mt-[350px] font-bold text-[24px]">
          Welcome To DevNote
        </div>
      )}

      {activeFile && (
        <div className={`flex ${isSplitScreen ? "split-screen" : ""}`}>
          {isSplitScreen && <div className="w-1 bg-gray-500" />}

          <pre className="text-center select-none border-r border-gray-700 text-gray-500 font-mono h-[100vh] px-2">
            {getLineNumbers()}
          </pre>

          {isSplitScreen && <div className="w-1 bg-gray-500" />} {/* Move the split line here */}
          
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
              className="code-display absolute top-0 left-0 w-full h-full z-0 overflow-hidden font-mono bg-black text-white "
            >
              <code>{code}</code>

              <div
              
                dangerouslySetInnerHTML={{
                  //@ts-ignore
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

            .split-screen {
              flex: 0 0 50%;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
