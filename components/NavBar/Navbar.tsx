import React, { useState, useRef } from 'react';

type NavbarProps = {
  wrapText: (wrapper: string) => void;
  createFile: (fileName: string) => void;
  selectFile: (fileName: string) => void;  
  fileNames: string[]; 
  activeFile: string | null;
};

const Navbar: React.FC<NavbarProps> = ({ wrapText, createFile, selectFile, fileNames,  activeFile  }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const makeBold = () => wrapText("**");
  const handleNewFile = () => {
    setIsCreatingFile(true);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(e.target.value);
  };

  const handleFileNameSubmit = () => {
    if (newFileName.trim() !== '') {
      setFiles((prevFiles) => [...prevFiles, newFileName]);
      createFile(newFileName);
      setNewFileName('');
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
    if (e.key === 'Enter') {
      handleFileNameSubmit();
    }
  };

  return (
    <div>
      <button onClick={handleNewFile} className="px-2" style={{ color: 'white' }}>
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
       <button onClick={makeBold} className="font-bold text-white bg-gray-500 pl-2 pr-2 rounded-[4px]">
        B
      </button>
      <div className="text-white px-2 flex items-center gap-2">
      {files.map((file, index) => (
        <button key={index} onClick={() => selectFile(file)} 
        className={`${file === activeFile ? 'border-b flex items-center bg-gray-500 pl-2 pr-2' : ''}`}

        >
          {file}
        </button>
      ))}
      </div>
    </div>
  );
};

export default Navbar;
