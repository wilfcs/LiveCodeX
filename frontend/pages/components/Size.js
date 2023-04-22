import React from 'react'

const Size = ({sizeOfFont, setSizeOfFont}) => {
  return (
    <div className="font-size w-28 m-2">
      <select
        id="size"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={sizeOfFont}
        onChange={(e) => {
          setSizeOfFont(e.target.value);
        }}
      >
        <option value="15">10px</option>
        <option value="16">11px</option>
        <option value="17">12px</option>
        <option value="18">13px</option>
        <option value="19">14px</option>
        <option value="20">15px</option>
        <option value="21">16px</option>
        <option value="22">17px</option>
        <option value="23">18px</option>
        <option value="24">19px</option>
        <option value="25">20px</option>
        <option value="26">21px</option>
        <option value="27">22px</option>
        <option value="28">23px</option>
        <option value="29">24px</option>
        <option value="30">25px</option>
      </select>
    </div>
  );
}

export default Size