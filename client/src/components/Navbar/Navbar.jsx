import React, { useEffect, useState } from 'react';
import { FaLeaf } from "react-icons/fa";
import { MdAddShoppingCart, MdMenu } from "react-icons/md";
import ResponsiveMenu from './ResponsiveMenu';
import { motion } from 'framer-motion';
import { getDecodedToken } from '../../utility/auth.decodeToken.utils';
import { useNavigate, useLocation } from 'react-router-dom';
import NavProfileDropDown from '../NavProfileDropDown';

const NavbarMenu = [
  { id: 0, title: "Home", link: "/", },
  { id: 1, title: "Products", link: "/falful/products", },
  { id: 2, title: "About", link: "#", }
];

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const [userRole, setUserRole] = useState(null);
  const [existToken, setExistToken] = useState(null);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const decodedToken = getDecodedToken();

    const publicRoutes = [
      "/",
      "/falful/user/seller/login",
      "/falful/user/buyer/register",
      "/falful/user/seller/register"
    ];

    // Only redirect if user is on a protected route and has no token
    if (!decodedToken && !publicRoutes.includes(location.pathname)) {
      navigate("/");
      return;
    }

    if (decodedToken) {
      setExistToken(decodedToken);
      setUserRole(decodedToken.role);
      setEmail(decodedToken.email);
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="container flex justify-between items-center py-4 md:pt-4">
          <div className='text-2xl flex items-center gap-2 font-bold uppercase'>
            <p className='text-primary'>FalFul</p>
            <FaLeaf className='text-green-500' />
          </div>
          <div className='hidden md:block'>
            <ul className='flex items-center gap-2 text-gray-600'>
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <a href={menu.link}
                    className='inline-block py-1 px-3
                    hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444]
                    font-semibold'
                  >{menu.title}</a>
                </li>
              ))} {userRole === "seller" && (
                <li>
                  <a href="/falful/products/add"
                    className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'>
                    Add Products
                  </a>
                </li>
              )}

              {!existToken ? (
                <>
                  <li>
                    <a href="/falful/user/buyer/register"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'>
                      buyer register
                    </a>
                  </li>

                  <li>
                    <a href="/falful/user/seller/register"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'>
                      buyer register
                    </a>
                  </li>
                  <li>
                    <a href="/falful/user/seller/login"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'>
                      login
                    </a>
                  </li>
                </>
              ) : (
                <>
                <div className="d-flex align-items-center">
                  {existToken &&<NavProfileDropDown email ={email} jwtToken={existToken} />}
                  </div>
                </>
              )}
              <button className='text-2xl hover:bg-primary hover:text-white rounded-full
                p-2 duration-200'>
                <MdAddShoppingCart />
              </button>
            </ul>
          </div>

          <div className='md:hidden' onClick={() =>
            setOpen(!open)}>
            <MdMenu className='text-4xl' />
          </div>
        </motion.div>
      </nav>

      <ResponsiveMenu open={open} />
    </>
  );
};

export default Navbar;