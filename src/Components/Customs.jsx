import React from 'react'
import { Route, Routes } from 'react-router'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Sign from '../pages/Sign'
import Option from '../pages/Option'

const Customs = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path='/option' element={<Option/>} />
            <Route path='/sign' element={<Sign/>} />
            <Route path='/login' element={<Login/>} />
        </Routes>
    </div>
  )
}

export default Customs