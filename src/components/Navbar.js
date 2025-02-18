import React from 'react';
import Dropdown from './Dropdown';
import useWindowDimensions from './useWindowDimensions';

const Navbar = (props) => {
  function openModal() {
    props.handleAddTechnologyModalOpen();
  }

  function resetTechRadar() {
    props.resetTechRadar();
  }

  function getTechRadarFromDb() {
    props.getTechRadarFromDb();
  }

  function saveTechRadarToDb() {
    props.onSaveClick();
  }

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { height, width } = useWindowDimensions();

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownItemClick = () => {
    setDropdownOpen(false);
  };

  return (
    <nav class='bg-white border-gray-200 dark:bg-gray-900 fixed w-screen mb-8'>
      <div class='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <a href='https://github.com/atalayozmen' class='flex items-center'>
          <img
            src='https://flowbite.com/docs/images/logo.svg'
            class='h-8 mr-3'
            alt='Flowbite Logo'
          />
          <span class='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
            Tech Radar
          </span>
        </a>
        {width <= 767 ? (
          <Dropdown
            openModal={openModal}
            open={dropdownOpen}
            onClick={handleDropdownClick}
            onItemClick={handleDropdownItemClick}
            onResetTechRadar={resetTechRadar}
            onSaveTechRadar={saveTechRadarToDb}
            onLoadTechRadar={getTechRadarFromDb}
          />
        ) : null}
        <div class='hidden w-full md:block md:w-auto' id='navbar-default'>
          <ul class='font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
            <li>
              <button
                onClick={openModal}
                class='block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
              >
                Add New Technology
              </button>
            </li>
            <li>
              <button
                onClick={saveTechRadarToDb}
                class='block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
              >
                Save Tech Radar to Database
              </button>
            </li>
            <li>
              <button
                onClick={resetTechRadar}
                class='block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
              >
                Reset Tech Radar
              </button>
            </li>
            <li>
              <button
                onClick={getTechRadarFromDb}
                class='block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
              >
                Load Tech Radar From Database
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
