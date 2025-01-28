// import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
    <div className='h-screen bg-slate-900'>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/game" element={<Game />}/> {/* 👈 Renders at /app/ */}
      </Routes>
    </BrowserRouter>
    </div>
    </>
  )
}

export default App
