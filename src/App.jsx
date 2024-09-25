import React from 'react'
import { BrowserRouter ,Routes , Route } from 'react-router-dom'


//pages 
import TodoApp from './pages/TodoApp'
import CrudGeneric from './pages/CrudGeneric'
import CrudTodo from './pages/CrudTodo'


// compnents 
import Navbar from './components/Navbar'
import Footer from './components/Footer'
const App = () => {
  return (
  

    <BrowserRouter>
<Navbar/>
    <Routes>

      <Route path='/' element={<TodoApp/>}/>
      <Route path='/gen' element={<CrudGeneric/>}/>
      <Route path='/todo' element={<CrudTodo/>}/>
    </Routes>

    <Footer/>
    </BrowserRouter>


  )
}

export default App