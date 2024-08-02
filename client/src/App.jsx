import Main from './components/Main';
import Liked from './components/Liked';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register'; 
import Item from './components/Item';
import { Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Routes>

      <Route path='/' element={<Main />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/liked' element={<Liked />} />
      <Route path='/my-deliveries' element={<div>In progress...</div>} />
      <Route path='/item/:itemId' element={<Item />} />

    </Routes>
  )
}

export default App
