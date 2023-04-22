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
        <option value="hc-black">hc-black</option>
        {/* <option value="hc-white">hc-white</option>
        <option value="azure">azure</option>
        <option value="clouds">clouds</option>
        <option value="chrome-devtools">chrome-devtools</option>
        <option value="github">github</option>
        <option value="kuroir">kuroir</option>
        <option value="eclipse">eclipse</option>
        <option value="tomorrow-night-blue">tomorrow-night-blue</option>
        <option value="monokai">monokai</option>
        <option value="solarized-dark">solarized-dark</option>
        <option value="textmate">textmate</option>
        <option value="tomorrow">tomorrow</option>
        <option value="twilight">twilight</option>
        <option value="xcode">xcode</option>
        <option value="solarized-dark">solarized-dark</option> */}
      </select>
    </div>
  );
}

export default Theme