import React from 'react'

function Dashboard() {
  return (
    <div className='w-full  p-14 '>
      <h1 className='text-4xl mb-4'>Dashboard</h1>
      <div className='flex w-full h-[100px] gap-4'>
        <div className='w-1/2 border-2 rounded-2xl p-3 h-full'>Complaints pending</div>
        <div className='w-1/2 border-2 rounded-2xl p-3 h-full'>Complaints resolved</div>
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default Dashboard