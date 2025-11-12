import React from 'react'

const LoadingSpin = ({text='data'}) => {
  return (
    <div className="flex items-center justify-center h-[50vh] text-gray-700 dark:text-gray-300">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mr-3"></div>
      Loading {text}...
    </div>
  )
}

export default LoadingSpin

