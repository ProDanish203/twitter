import React from 'react'

const loading = () => {
  return (
    <div className='flex justify-center w-full my-20'>
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default loading;