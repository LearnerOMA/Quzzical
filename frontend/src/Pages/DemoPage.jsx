import React from 'react'

function DemoPage() {
  return (
    <div>
        <nav className="bg-[#5D4B8C] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl flex items-center gap-2">
            Demo
          </div>
        </div>
      </nav>
      <div className='container mx-auto'>
       <div className='bg-white p-2 h-[100vh]'>
        <div className='flex flex-1 align-center font-bold justify-center mt-20'>
            Hello All
        </div>
       </div>
    </div>
      <footer className="bg-[#5D4B8C] p-4 text-white text-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center gap-4">
            this is  footer
          </div>
        </div>
    </footer>
    </div>
  )
}

export default DemoPage