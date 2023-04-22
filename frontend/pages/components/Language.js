import React from 'react'

const Language = ({language, setLanguage}) => {
  return (
    <div className="language-change w-28">
      <select
        id="language"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={language}
        onChange={(e) => {
          let response = window.confirm(
            "WARNING: Switching the language will remove your current code. Do you want to proceed?"
          );
          if (response) setLanguage(e.target.value);
        }}
      >
        <option value="cpp">C++</option>
        <option value="py">Python</option>
      </select>
    </div>
  );
}

export default Language