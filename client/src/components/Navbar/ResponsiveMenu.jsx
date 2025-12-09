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
    <AnimatePresence>
      {open && (
        <motion.div
          className="
    fixed top-0 left-0 w-full h-full 
    bg-black bg-opacity-50 z-[999]
    overflow-x-hidden
    md:hidden
  ">
          <div
            className="
    bg-white text-gray-800 
    w-full max-w-[330px] mx-auto mt-24 p-6 pl-0
    rounded-3xl shadow-xl 
    max-h-[80vh] overflow-y-auto overflow-x-hidden">
            <ul className="flex flex-col p-2 pl-5 gap-6 w-full overflow-x-hidden">
              {NavbarMenu.map((menu) => (
                <li key={menu.id} onClick={closeMenu}>
                  <a
                    href={menu.link}
                    className="hover:text-primary text-lg"
                  >
                    {menu.title}
                  </a>
                </li>
              ))}

              {/* SELLER MENU */}
              {existToken && userRole === UserType.SELLER && (
                <>
                  <li onClick={closeMenu}>
                    <a href="/falful/product/myproducts" className="hover:text-primary text-lg">
                      My Products
                    </a>
                  </li>
                  <li onClick={closeMenu}>
                    <a href="/falful/products/add" className="hover:text-primary text-lg">
                      Add Products
                    </a>
                  </li>
                  <li onClick={closeMenu}>
                    <a href="/falful/buyer/list" className="hover:text-primary text-lg">
                      View Buyers
                    </a>
                  </li>
                </>
              )}

              {/* BUYER MENU */}
              {existToken && userRole === UserType.BUYER && (
                <>
                  <li onClick={closeMenu}>
                    <a href="/falful/buyer/list" className="hover:text-primary text-lg">
                      View Sellers
                    </a>
                  </li>
                  <li onClick={closeMenu}>
                    <a href="/falful/buyer/orders" className="hover:text-primary text-lg">
                      My Orders
                    </a>
                  </li>
                </>
              )}

              {/* NO TOKEN → REGISTER + LOGIN */}
              {!existToken && (
                <>
                  {/* REGISTER */}
                  <li className="relative w-full px-6">
                    <button
                      onClick={() => {
                        setRegisterDropdown(!registerDropdown);
                        setLoginDropdown(false);
                      }}
                      className="flex justify-between w-full text-lg"
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

                  {/* LOGIN */}
                  <li className="relative w-full px-6">
                    <button
                      onClick={() => {
                        setLoginDropdown(!loginDropdown);
                        setRegisterDropdown(false);
                      }}
                      className="flex justify-between w-full text-lg"
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

              {/* CART BUTTON */}
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
