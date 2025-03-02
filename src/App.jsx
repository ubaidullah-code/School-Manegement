import React from 'react'
import { initializeApp } from "firebase/app";
import Login from './pages/Login'
import Option from './pages/Option'
import Landing from './pages/Landing'
import Custom from "./Components/Customs"


const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBRDYTbXrg2zKBBJhL_LnhU8piWQWT1mrI",
    authDomain: "school-manegement-1.firebaseapp.com",
    projectId: "school-manegement-1",
    storageBucket: "school-manegement-1.firebasestorage.app",
    messagingSenderId: "952419821277",
    appId: "1:952419821277:web:ccba05b9718e1558549d34"
  };
  const app = initializeApp(firebaseConfig);
  return (
  //   <div className="bg-green-500 text-white text-center p-6">

  //   Tailwind is working in CRA! 🚀
  // </div>
  // <Login/>
  // <Option/>
  <Custom/>
  // <Landing/>
  )
}

export default App
