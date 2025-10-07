import React, { useState } from 'react';

const PasswordGenerator = ({ onGenerate }) => {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()';
    if (excludeLookAlikes) {
      charset = charset.replace(/[0OIl1]/g, '');
    }

    let newPass = '';
    for (let i = 0; i < length; i++) {
      newPass += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPass);
    onGenerate(newPass);
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    // Auto-clear after 15s
    setTimeout(() => navigator.clipboard.writeText(''), 15000);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Password Generator</h2>
      <div className="mb-4">
        <label className="block mb-2">Length: {length}</label>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="space-y-2 mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="mr-2"
          />
          Include Numbers
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="mr-2"
          />
          Include Symbols
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={excludeLookAlikes}
            onChange={(e) => setExcludeLookAlikes(e.target.checked)}
            className="mr-2"
          />
          Exclude Look-alikes
        </label>
      </div>
      <button
        onClick={generatePassword}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
      >
        Generate
      </button>
      {password && (
        <div className="flex items-center mt-4">
          <span className="mr-2 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {password}
          </span>
          <button
            onClick={() => copyToClipboard(password)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;