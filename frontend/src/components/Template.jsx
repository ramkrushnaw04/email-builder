import React from 'react'
import { useNavigate } from 'react-router-dom'

const Template = ({name}) => {
    const navigate = useNavigate()

    function navigateTo() {
        navigate('/'+name)
    }


  return (
    <button 
        className='w-[230px] h-[380px] bg-white'
        onClick={navigateTo}
    >
        {name}
    </button>
  )
}

export default Template
