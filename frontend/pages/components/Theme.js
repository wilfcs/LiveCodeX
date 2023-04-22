import React from 'react'

const Theme = ({theme, setTheme}) => {
  return (
    <div className="theme-change w-28 mx-4">
      <select
        id="themes"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={theme}
        onChange={(e) => {
          setTheme(e.target.value);
        }}
      >
        <option value="vs-dark">vs-dark</option>
        <option value="vs-light">vs-light</option>
      </select>
    </div>
  );
}

export default Theme