import React from 'react';

const Dropdown = (props) => {
  const {
    onClick,
    onItemClick,
    open,
    openModal,
    onResetTechRadar,
    onSaveTechRadar,
    onLoadTechRadar,
  } = props;

  const handleNewTechnologyClick = () => {
    openModal();
    onItemClick();
  };

  const handleSaveTechRadar = () => {
    onSaveTechRadar();
    onItemClick();
  };

  const handleLoadTechRadar = () => {
    onLoadTechRadar();
    onItemClick();
  };

  const handleResetTechRadar = () => {
    onResetTechRadar();
    onItemClick();
  };

  return (
    <div>
      <button
        onClick={props.onClick}
        id='dropdownDefaultButton'
        data-dropdown-toggle='dropdown'
        class='text-white mr-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        type='button'
      >
        Menu{'     '}
        <svg
          class='w-4 h-4 ml-2'
          aria-hidden='true'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M19 9l-7 7-7-7'
          ></path>
        </svg>
      </button>

      {props.open && (
        <div
          id='dropdown'
          class='z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'
          style={{
            position: 'absolute',
            top: '100%',
            right: '1rem',
            marginTop: '4px', // Add some margin to separate the dropdown from the button
          }}
        >
          <ul
            class='py-2 text-sm text-gray-700 dark:text-gray-200'
            aria-labelledby='dropdownDefaultButton'
          >
            <li>
              <btn
                onClick={handleNewTechnologyClick}
                class='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Add New Technology
              </btn>
            </li>
            <li>
              <btn
                onClick={handleSaveTechRadar}
                class='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Save Tech Radar to Database
              </btn>
            </li>
            <li>
              <btn
                onClick={handleResetTechRadar}
                class='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Reset Tech Radar
              </btn>
            </li>
            <li>
              <btn
                onClick={handleLoadTechRadar}
                class='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Load Tech Radar From Database
              </btn>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
