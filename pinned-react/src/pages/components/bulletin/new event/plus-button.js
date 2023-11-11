import React from 'react'

import { HiPlus } from "react-icons/hi"

const PlusButton = ({isDisabled, setIsEditEventMenuOpen}) => {

  const openMenu = () => {
    setIsEditEventMenuOpen(true)
  }

  return (
    <div>
      <button 
        className='fixed bottom-4 right-6 sm:bottom-6 sm:right-8 md:bottom-8 md:right-10  p-2 text-[2rem] rounded-full bg-actionOrange text-white hover:scale-110 active:scale-105 disabled:hover:scale-100' 
        onClick={() => openMenu()}
        disabled={isDisabled}
      >
        <HiPlus />
      </button>
    </div>
  )
}

export default PlusButton;
