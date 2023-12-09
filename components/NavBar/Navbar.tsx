import React, { useState, useRef } from 'react';

const Navbar: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleNewFile = () => {
    setIsCreatingFile(true);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(e.target.value);
  };

  const handleFileNameSubmit = () => {
    if (newFileName.trim() !== '') {
      setFiles((prevFiles) => [...prevFiles, newFileName]);
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
      <button onClick={handleNewFile} className="btn btn-light" style={{ color: 'white' }}>
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
      <div className="text-white">
        {files.map((file, index) => (
          <span key={index} className="mx-1">
            {file}
            {index < files.length - 1 && ' || '}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
