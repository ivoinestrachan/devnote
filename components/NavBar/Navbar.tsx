import React, { useState, useRef } from "react";

type NavbarProps = {
  wrapText: (wrapper: string) => void;
  createFile: (fileName: string) => void;
  selectFile: (fileName: string) => void;
  splitScreen: () => void;
  fileNames: string[];
  activeFile: string | null;
};

const Navbar: React.FC<NavbarProps> = ({
  wrapText,
  createFile,
  selectFile,
  splitScreen,
  fileNames,
  activeFile,
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const makeBold = () => wrapText("**");
  const makeItalic = () => wrapText("*");
  const makeBulletPoint = () => {
    const textarea = document.querySelector(
      ".code-input"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);

    const newText =
      start !== end
        ? `${textarea.value.slice(
            0,
            start
          )}  • ${selectedText}${textarea.value.slice(end)}\n`
        : `${textarea.value.slice(0, start)}  • ${textarea.value.slice(
            start
          )}\n`;

    wrapText(newText);
  };

  const handleNewFile = () => {
    setIsCreatingFile(true);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(e.target.value);
  };

  const handleFileNameSubmit = () => {
    if (newFileName.trim() !== "") {
      setFiles((prevFiles) => [...prevFiles, newFileName]);
      createFile(newFileName);
      setNewFileName("");
      setIsCreatingFile(false);
    } else {
      // no file name, close box
      setIsCreatingFile(false);
    }
  };

  const handleBlur = () => {
    handleFileNameSubmit();
  };

  // enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFileNameSubmit();
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleNewFile}
        className="px-2"
        style={{ color: "white" }}
      >
        New File
      </button>

      {isCreatingFile && (
        <input
          ref={inputRef}
          type="text"
          value={newFileName}
          onChange={handleFileNameChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter file name"
          className="mx-2"
          autoFocus
        />
      )}
      <button
        onClick={makeBold}
        className="font-bold text-white bg-gray-500 pl-2 pr-2 rounded-[4px]"
      >
        B
      </button>
      <button
        onClick={makeItalic}
        className="font-bold text-white bg-gray-500 pl-3 pr-3 rounded-[4px] ml-2"
      >
        𝐼
      </button>

      <button
        onClick={makeBulletPoint}
        className="font-bold text-white bg-gray-500 pl-3 pr-3 rounded-[4px] ml-2"
      >
        Bullet List
      </button>

      <button
        onClick={splitScreen}
        className="font-bold text-white bg-gray-500 pl-2 pr-2 rounded-[4px] ml-2"
      >
        Split Screen
      </button>
      
      <div className="text-white px-2 flex items-center gap-2">
        {files.map((file, index) => (
          <button
            key={index}
            onClick={() => selectFile(file)}
            className={`${
              file === activeFile
                ? "border-b flex items-center bg-gray-500 pl-2 pr-2"
                : ""
            }`}
          >
            {file}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
