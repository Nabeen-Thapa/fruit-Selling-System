import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import  ProductsPage  from './pages/products.page'
import { HomePage } from './pages/Home.page'
import AddProductPage from './pages/AddProducts.page';
const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        {/*        
        <Menus/>
        <Banner/>
        <Banner2/>
        <Banner3/> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/falful/products" element={<ProductsPage />} />
          <Route path="/falful/products/add" element={<AddProductPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
