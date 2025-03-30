import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet } from 'react-router'

const Website = () => {
  return (
    <div className="min-h-screen">
        <Navbar/>
        <div className="mt-8">
            <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default Website;