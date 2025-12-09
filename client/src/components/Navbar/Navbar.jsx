import React, { useEffect, useState } from 'react';
import { FaLeaf, FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { MdAddShoppingCart, MdMenu, MdExpandMore, MdExpandLess } from "react-icons/md";
import ResponsiveMenu from './ResponsiveMenu';
import { motion } from 'framer-motion';
import { fetchCurrentUser } from '../../services/auth.fetchCurrentUser.utils';
import { useNavigate, useLocation } from 'react-router-dom';
import NavProfileDropDown from './NavProfileDropDown';
import { UserType } from '../../types/user.types';
import { useCurrentUser } from '../../utility/currentUser.utils';

const NavbarMenu = [
  { id: 0, title: "Home", link: "/", },
  { id: 1, title: "Products", link: "/falful/products", },
  { id: 2, title: "About", link: "/falful/about", }
];

const Navbar = ({ onCartClick }) => {
  const [open, setOpen] = React.useState(false);
  const [userRole, setUserRole] = useState(null);
  const [existToken, setExistToken] = useState(null);
  const [name, setName] = useState(null);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUserRole, loading } = useCurrentUser();
  useEffect(() => {
    console.log("User role:", currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    const getUser = async () => {
      const decodedToken = await fetchCurrentUser();

      const publicRoutes = [
        "/",
        "/falful/user/seller/login",
        "/falful/user/buyer/register",
        "/falful/user/seller/register",
        "/falful/user/buyer/login",
        "/falful/products"
      ];

      if (!decodedToken && !publicRoutes.includes(location.pathname)) {
        navigate("/falful/user/buyer/login");
        return;
      }

      if (decodedToken) {
        setExistToken(decodedToken);
        setUserRole(decodedToken.role);
        setName(decodedToken.name);
      }
    };

    getUser();
  }, [navigate, location.pathname]);

  const toggleRegisterDropdown = () => {
    setRegisterDropdownOpen(!registerDropdownOpen);
    setLoginDropdownOpen(false);
  };

  const toggleLoginDropdown = () => {
    setLoginDropdownOpen(!loginDropdownOpen);
    setRegisterDropdownOpen(false);
  };

  useEffect(() => {
    if (open) {
      setRegisterDropdownOpen(false);
      setLoginDropdownOpen(false);
    }
  }, [open]);

  return (
    <>
      {/* COMPLETELY REMOVED pr-60 - NO RIGHT PADDING */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 px-4 py-3 flex items-center justify-between md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full flex justify-between items-center"
        >
          {/* Logo - NO right margin on mobile */}
          <div className='text-2xl flex items-center gap-2 font-bold uppercase'>
            <p className='text-primary'>FalFul</p>
            <FaLeaf className='text-green-500' />
          </div>
          
          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <ul className='flex items-center gap-4 text-gray-600'>
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <a 
                    href={menu.link}
                    className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'
                  >
                    {menu.title}
                  </a>
                </li>
              ))}

              {userRole === UserType.SELLER && (
                <>
                  <li>
                    <a 
                      href="/falful/product/myproducts"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'
                    >
                      my Products
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/falful/products/add"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'
                    >
                      Add Products
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/falful/buyer/list"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'
                    >
                      view buyers
                    </a>
                  </li>
                  {/* <li>
                    <a 
                      href="/falful/buyer/list"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'
                    >
                      orders
                    </a>
                  </li> */}
                </>
              )}

              {userRole === UserType.BUYER && (
                <>
                  <li>
                    <a 
                      href="/falful/buyer/list"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'
                    >
                      view sellers
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/falful/buyer/orders"
                      className='inline-block py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold'
                    >
                      My orders
                    </a>
                  </li>
                </>
              )}
              
              {!existToken ? (
                <>
                  <li className="relative">
                    <button
                      onClick={toggleRegisterDropdown}
                      className="flex items-center gap-1 py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold"
                    >
                      <FaUserPlus className="mr-1" />
                      Register
                      {registerDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                    </button>
                    {registerDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <a
                          href="/falful/user/buyer/register"
                          className="block px-4 py-2 text-lg text-gray-700 hover:bg-primary hover:text-white"
                        >
                          Register as Buyer
                        </a>
                        <a
                          href="/falful/user/seller/register"
                          className="block px-4 py-2 text-lg text-gray-700 hover:bg-primary hover:text-white"
                        >
                          Register as Seller
                        </a>
                      </div>
                    )}
                  </li>

                  <li className="relative">
                    <button
                      onClick={toggleLoginDropdown}
                      className="flex items-center gap-1 py-1 px-3 hover:text-primary hover:shadow-[0_3px_0_-1px_#ef4444] font-semibold"
                    >
                      <FaSignInAlt className="mr-1" />
                      Login
                      {loginDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
                    </button>
                    {loginDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <a
                          href="/falful/user/buyer/login"
                          className="block px-4 py-2 text-lg text-gray-700 hover:bg-primary hover:text-white"
                        >
                          Login as Buyer
                        </a>
                        <a
                          href="/falful/user/seller/login"
                          className="block px-4 py-2 text-lg text-gray-700 hover:bg-primary hover:text-white"
                        >
                          Login as Seller
                        </a>
                      </div>
                    )}
                  </li>
                </>
              ) : (
                <div className="flex items-center">
                  {existToken && <NavProfileDropDown name={name} jwtToken={existToken} userRole={userRole} />}
                </div>
              )}
              
              {existToken && userRole === UserType.BUYER && (
                <button 
                  className='text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200' 
                  onClick={onCartClick}
                >
                  <MdAddShoppingCart />
                </button>
              )}
            </ul>
          </div>

          {/* Mobile Hamburger Menu Button - Now fully visible */}
          <button 
            className='md:hidden text-3xl p-2 hover:bg-gray-100 rounded-full transition-colors'
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <MdMenu />
          </button>
        </motion.div>
      </nav>

      <div className="md:hidden">
        <ResponsiveMenu
          open={open}
          setOpen={setOpen}
          NavbarMenu={NavbarMenu}
          userRole={userRole}
          existToken={existToken}
          onCartClick={onCartClick}
        />
      </div>
    </>
  );
};

export default Navbar;