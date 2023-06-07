import React from 'react';
import SelectComp from './SelectComp';

const quadrantSelectElements = [
  {
    label: 'Languages',
    value: 0,
  },
  {
    label: 'Infrastructure',
    value: 1,
  },
  {
    label: 'Datastores',
    value: 2,
  },
  {
    label: 'Frameworks and Libraries',
    value: 3,
  },
];

const ringSelectElements = [
  {
    label: 'Adopt',
    value: 0,
  },
  {
    label: 'Trial',
    value: 1,
  },
  {
    label: 'Assess',
    value: 2,
  },
  {
    label: 'Hold',
    value: 3,
  },
];

const ModalComponent = (props) => {
  const { label, quadrant, ring, handleModalSubmit } = props;

  if (props.showModal) {
    return (
      <div
        id='authentication-modal'
        tabindex='-1'
        aria-hidden='true'
        class='fixed flex justify-center content-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full'
      >
        <div class='flex w-full max-w-md max-h-full'>
          <div class='relative bg-white rounded-lg shadow dark:bg-gray-700 w-full'>
            <button
              onClick={props.handleModalClose}
              type='button'
              class='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white'
              data-modal-hide='authentication-modal'
            >
              <svg
                aria-hidden='true'
                class='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clip-rule='evenodd'
                ></path>
              </svg>
              <span class='sr-only'>Close modal</span>
            </button>
            <div class='px-6 py-6 lg:px-8'>
              <h3 class='mb-4 text-xl font-medium text-gray-900 dark:text-white'>
                Edit {label} Technology
              </h3>
              <form class='space-y-6' action='#' onSubmit={handleModalSubmit}>
                <div>
                  <label
                    for='email'
                    class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Change Technology Type
                  </label>
                  <SelectComp
                    handleChange={props.handleQuadrantChange}
                    selected={{
                      value: quadrant,
                      label: quadrantSelectElements[quadrant].label,
                    }}
                    elements={quadrantSelectElements}
                  />
                </div>
                <div>
                  <label
                    for='password'
                    class='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Change Technology Ring
                  </label>
                  <SelectComp
                    handleChange={props.handleRingChange}
                    selected={{
                      value: ring,
                      label: ringSelectElements[ring].label,
                    }}
                    elements={ringSelectElements}
                  />
                </div>
                <div class='flex justify-between'>
                  <div class='flex items-start'>
                    <div class='flex items-center h-5'></div>
                  </div>
                </div>
                <button
                  type='submit'
                  value='edit'
                  class='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Edit Technology
                </button>
                <button
                  type='button'
                  onClick={props.handleModalDelete}
                  class='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Delete Technology
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ModalComponent;
