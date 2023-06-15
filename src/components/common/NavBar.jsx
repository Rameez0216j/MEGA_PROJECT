import React from "react";
import { useEffect } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropdown from "../core/Auth/ProfileDropdown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const NavBar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      console.log(result);
      setSubLinks(result.data.allCategory);
      console.log(subLinks);
      // setSubLinks(result.data.data);
    } catch (error) {
      console.log("Error occured while fetching Categories");
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

//   const subLinks = [
//     {
//         title: "python",
//         link:"/catalog/python"
//     },
//     {
//         title: "web dev",
//         link:"/catalog/web-development"
//     },
// ];

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex w-11/12 max-w-maxContent justify-between items-center">
        {/* Image */}
        <Link to="/">
          <img src={logo} alt="Logo" height={42} width={160} loading="lazy" />
        </Link>

        {/* Nav Links */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="relative flex items-center gap-2 group">
                    <p>{link.title}</p>
                    <IoIosArrowDropdownCircle />

                    <div
                      className="invisible absolute left-[50%]
                      translate-x-[-50%] translate-y-[15%]
                   top-[50%]
                  flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                  opacity-0 transition-all duration-200 group-hover:visible
                  group-hover:opacity-100 lg:w-[300px] z-[5] max-h-[200px] overflow-auto [&::-webkit-scrollbar]:hidden"
                    >
                      <div
                        className="absolute left-[50%] top-0
                  translate-x-[80%]
                  translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5 z-10"
                      ></div>

                      {subLinks.length ? (
                        subLinks.map((subLink, index) => (
                          <Link to={`${subLink.name.toLowerCase().split(" ").join("-")}`} key={index} className="text-center px-4 py-2 hover:border-[1px] hover:bg-richblack-100 rounded-md">
                            <p>{subLink.name}</p>
                          </Link>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                    // className={`${
                    //   matchRoute(link?.path)
                    //     ? "text-yellow-25"
                    //     : "text-richblack-25"
                    // }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login/signup buttons */}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart />
              {totalItems > 0 && <span className="">{totalItems}</span>}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md font-semibold transition-all duration-100 hover:text-richblack-900 hover:bg-yellow-25">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md font-semibold transition-all duration-100 hover:text-richblack-900 hover:bg-yellow-25">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
