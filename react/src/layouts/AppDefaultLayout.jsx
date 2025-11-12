import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Header from '../components/Hearder.jsx'
import Container from '../components/Container.jsx'

const AppDefaultLayout = () => {

  return (
    <div className='h-min-screen '>

      <Header />

      <main>
        <Container>
          <Outlet />
        </Container>
      </main>

      <Footer />
    </div>
  )
}

export default AppDefaultLayout
