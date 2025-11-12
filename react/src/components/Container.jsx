const Container = ({ children } ) => {
  return (
    <div className='container w-[95%] sm:w-[80%] mx-auto py-10'>
      {children}
    </div>
  )
}

export default Container
