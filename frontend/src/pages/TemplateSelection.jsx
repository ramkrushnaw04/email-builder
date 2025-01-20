import React from 'react'
import Template from '../components/template'

const TemplateSelection = () => {
  return (
    <main className='w-screen h-screen bg-orange-200 flex justify-center items-center gap-20'>
      <Template name={'template1'} />
      <Template name={'template2'} />
    </main>
  )
}

export default TemplateSelection
