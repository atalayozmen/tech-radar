import React from 'react';

const SelectComp = (props) => {
  const { elements, selected } = props;
  return (
    <div>
      <select
        onChange={(e) => props.handleChange(e)}
        id='countries'
        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      >
        <option value={selected.value} selected>
          {' '}
          {selected.label}
        </option>
        {elements.map((element) => (
          <option value={element.value}>{element.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectComp;
