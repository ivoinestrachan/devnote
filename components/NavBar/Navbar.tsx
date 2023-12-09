import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);

  const handleNewFile = () => {
    const fileName = prompt('Enter the name of the new file:');
    if (fileName) {
      setFiles((prevFiles) => [...prevFiles, fileName]);
    }
  };

  return (
    <div>
      <button onClick={handleNewFile} className="btn btn-light" style={{ color: 'white' }}>New File</button>
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
