import React from 'react'
import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'

const router =(
   <Router>
     <Routes>
       <Route path="/dashboard" exact element={< Home />}></Route>
       <Route path="/login" element={<Login />} />
       <Route path="/signUp" exact element={< SignUp />}></Route>

     </Routes>
   </Router>
);


const App = () => {
  return (
    <div>
      {router}
    </div>
  )
}

export default App
