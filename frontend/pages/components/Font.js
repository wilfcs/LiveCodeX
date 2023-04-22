import React from 'react'

const Font = ({familyOfFont, setFamilyOfFont}) => {
  return (
    <div className="font-family w-28 m-2">

      <select
        id="font"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={familyOfFont}
        onChange={(e) => {
          setFamilyOfFont(e.target.value);
        }}
      >
        <option value="default">Default</option>
        <option value="Courier New">Courier New</option>
      </select>
    </div>
  );
}

export default Font