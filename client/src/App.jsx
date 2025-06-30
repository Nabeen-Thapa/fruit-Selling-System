import React, { useEffect,useState } from 'react';
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
import ViewMyProducts from './pages/product/viewMyProducts.page';
import ViewSellerData from './pages/users/viewSeller.page';
import UsersList from './pages/users/buyer.getUsers.page';
import UsersChat from './pages/users/usersChat.page';
import { useCurrentUser } from './utility/currentUser.utils';
import UpdateBuyerData from './pages/users/updateBuyer.page';
import ViewProductToBuyer from './pages/product/viewSellersProductTobuyer.page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartModal from './components/products/viewMyCartModal';
import CheckoutPage from './pages/product/checkout.page';

const App = () => {  
  const { currentUserRole, loading } = useCurrentUser();
    const [isCartOpen, setIsCartOpen] = useState(false);
  useEffect(() => {
    console.log("User role:", currentUserRole);
  }, [currentUserRole]);
  return (
    <>
      <Router>
        <Navbar onCartClick={() => setIsCartOpen(true)} />
         <ToastContainer position="top-right" autoClose={3000} />
          <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
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
          <Route path="/falful/product/myproducts" element={<ViewMyProducts/>} />
          <Route path="/falful/products/:sellerId/products" element={<ViewProductToBuyer/>} />
          <Route path="/falful/seller/view" element={<ViewSellerData/>} />
          <Route path="/falful/buyer/view" element={<UpdateBuyerData/>} />
          <Route path={`/falful/buyer/sellerlist`} element={<UsersList/>} />
          <Route path="/falful/user/chat/:id" element={<UsersChat/>} />
          <Route path="/falful/product/checkout" element={<CheckoutPage/>} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
