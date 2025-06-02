import React from 'react';
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
import { SellerRegister } from './pages/users/sellerRegister.page';
import LoginPage from './pages/users/auth.sellerLogin.page';
import VerifyUser from './middleware/auth.verifyToken';
import BuyerLogin from './pages/users/auth.buyerLOgin.page';
import ViewSpecificProductPage from './pages/product/viewSpecificProduct.page';
import ProductUpdatePage from './pages/product/productUpdate.page';

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <VerifyUser/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/falful/products" element={<ViewProducts />} />
          <Route path="/falful/products/add" element={<AddProductPage/>} />
          <Route path="/falful/user/buyer/register" element={<BuyerRegister/>} />
          <Route path="/falful/user/seller/register" element={<SellerRegister/>} />
          <Route path="/falful/user/seller/login" element={<LoginPage/>} />
          <Route path="/falful/user/buyer/login" element={<BuyerLogin/>} />
          <Route path="/falful/product/:id/view" element={<ViewSpecificProductPage/>} />
          <Route path="/falful/product/:id/update" element={<ProductUpdatePage/>} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
