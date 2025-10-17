import React from 'react'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/login'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Toaster position='bottom-left'/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      
    </div>
  )
}

export default App
