import React, { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const getLineNumbers = () => {
    const numberOfLines = code.split('\n').length;
    return Array.from({ length: numberOfLines }, (_, i) => i + 1).join('\n');
  };

  return (
    <div className="flex">
      <pre className="text-right pr-2 select-none border-r border-gray-200 text-gray-600 leading-6 font-mono h-[100vh] px-2">
        {getLineNumbers()}
      </pre>
      <textarea
        value={code}
        onChange={handleChange}
        className="flex-1 border-none resize-none outline-none font-mono leading-6"
      />
    </div>
  );
}
