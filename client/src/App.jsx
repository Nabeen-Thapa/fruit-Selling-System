import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { HomePage } from './pages/Home.page'
import ViewProducts from './pages/product/viewProducts.page';
import AddProductPage from './pages/product/AddProducts.page';
import { BuyerRegister } from './pages/users/buyerRegister.page';
const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/falful/products" element={<ViewProducts />} />
          <Route path="/falful/products/add" element={<AddProductPage/>} />
          <Route path="/falful/user/buyer/register" element={<BuyerRegister/>} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
