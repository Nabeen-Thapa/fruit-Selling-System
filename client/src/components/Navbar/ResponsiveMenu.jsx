import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { MdAddShoppingCart, MdExpandLess, MdExpandMore } from "react-icons/md";
import { UserType } from "../../types/user.types";

const ResponsiveMenu = ({
  open,
  setOpen,
  NavbarMenu,
  userRole,
  existToken,
  onCartClick
}) => {
  const [registerDropdown, setRegisterDropdown] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-0 w-full h-screen z-50 bg-black bg-opacity-50 md:hidden"
        >
          <div className="text-lg font-semibold uppercase bg-white text-gray-800 py-10 mx-4 rounded-3xl shadow-lg">
            <ul className="flex flex-col items-center gap-6">

              {/* STATIC NAV MENU */}
              {NavbarMenu.map((menu) => (
                <li key={menu.id} onClick={closeMenu}>
                  <a href={menu.link} className="hover:text-primary">
                    {menu.title}
                  </a>
                </li>
              ))}

              {/* SELLER MENU */}
              {existToken && userRole === UserType.SELLER && (
                <>
                  <li onClick={closeMenu}>
                    <a href="/falful/product/myproducts" className="hover:text-primary">
                      My Products
                    </a>
                  </li>
                  <li onClick={closeMenu}>
                    <a href="/falful/products/add" className="hover:text-primary">
                      Add Products
                    </a>
                  </li>
                  <li onClick={closeMenu}>
                    <a href="/falful/buyer/sellerlist" className="hover:text-primary">
                      View Buyers
                    </a>
                  </li>
                </>
              )}

              {/* BUYER MENU */}
              {existToken && userRole === UserType.BUYER && (
                <>
                  <li onClick={closeMenu}>
                    <a href="/falful/buyer/sellerlist" className="hover:text-primary">
                      View Sellers
                    </a>
                  </li>
                  <li onClick={closeMenu}>
                    <a href="/falful/buyer/orders" className="hover:text-primary">
                      My Orders
                    </a>
                  </li>
                </>
              )}

              {/* AUTH MENUS */}
              {!existToken && (
                <>
                  {/* REGISTER DROPDOWN */}
                  <li className="relative w-full px-6">
                    <button
                      onClick={() => {
                        setRegisterDropdown(!registerDropdown);
                        setLoginDropdown(false);
                      }}
                      className="flex justify-between w-full"
                    >
                      <span className="flex items-center gap-2">
                        <FaUserPlus /> Register
                      </span>
                      {registerDropdown ? <MdExpandLess /> : <MdExpandMore />}
                    </button>

                    {registerDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 bg-gray-100 rounded-lg p-3 shadow"
                      >
                        <a
                          href="/falful/user/buyer/register"
                          onClick={closeMenu}
                          className="block py-1 hover:text-primary"
                        >
                          Register as Buyer
                        </a>
                        <a
                          href="/falful/user/seller/register"
                          onClick={closeMenu}
                          className="block py-1 hover:text-primary"
                        >
                          Register as Seller
                        </a>
                      </motion.div>
                    )}
                  </li>

                  {/* LOGIN DROPDOWN */}
                  <li className="relative w-full px-6">
                    <button
                      onClick={() => {
                        setLoginDropdown(!loginDropdown);
                        setRegisterDropdown(false);
                      }}
                      className="flex justify-between w-full"
                    >
                      <span className="flex items-center gap-2">
                        <FaSignInAlt /> Login
                      </span>
                      {loginDropdown ? <MdExpandLess /> : <MdExpandMore />}
                    </button>

                    {loginDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 bg-gray-100 rounded-lg p-3 shadow"
                      >
                        <a
                          href="/falful/user/buyer/login"
                          onClick={closeMenu}
                          className="block py-1 hover:text-primary"
                        >
                          Login as Buyer
                        </a>
                        <a
                          href="/falful/user/seller/login"
                          onClick={closeMenu}
                          className="block py-1 hover:text-primary"
                        >
                          Login as Seller
                        </a>
                      </motion.div>
                    )}
                  </li>
                </>
              )}

              {/* CART FOR BUYER */}
              {existToken && userRole === UserType.BUYER && (
                <button
                  className="text-3xl hover:text-primary"
                  onClick={() => {
                    onCartClick();
                    closeMenu();
                  }}
                >
                  <MdAddShoppingCart />
                </button>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
