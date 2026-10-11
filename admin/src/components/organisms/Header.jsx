"use client";
import { useEffect, useState, useRef } from "react";
import Button from "../common/Button";
// import SearchBox from "../atoms/SearchBox";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import OverlayModal from "../common/OverlayModal";
import { LogoutModal } from "../common/LogoutModal";
import { logout } from "../redux/slice/auth-slice";

export default function Header({ onMenuClick }) {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState("light");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogoutConfirm = async () => {
    await dispatch(logout());
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      setTheme(saved);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(saved);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-header bg-slate-50">
        <div className="h-16 flex items-center justify-between px-4 md:px-6 gap-2">
          <div className="flex items-center gap-3 w-full max-w-md">

            <Button
              onClick={onMenuClick}
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-100 lg:hidden"
            >
              <i className="ri-menu-2-line text-xl" />
            </Button>

            {/* <div className="relative w-full">
              <SearchBox
                iconLeft={true}
                placeholder="Search strategies, users, trades..."
              />
            </div> */}

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 ">
            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              {theme === "light" ? (
                <i className="ri-sun-line"></i>
              ) : (
                <i className="ri-moon-line"></i>
              )}
            </button> */}

            {/* Notification */}
            {/* <div className="relative">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-bell w-4 h-4" data-fg-jnd11="1.18:4.1635:/src/app/components/TopBar.tsx:41:11:1838:28:e:Bell::::::CiHR" data-fgid-jnd11=":r2r:"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>
              </button>

              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </div> */}

            {/* User */}
            <div
              ref={profileRef}
              onClick={() => setProfileOpen(!profileOpen)}
              className="relative flex items-center gap-2 hover:bg-slate-100 transition-all py-1.5 px-3 rounded-lg md:rounded-xl cursor-pointer">

              <div className="w-8 h-8 capitalize rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md  btn-gradient"
              >
                {user?.name?.charAt([0]) || <i className="ri-user-3-line"></i>}
              </div>

              <div className="max-w-20 overflow-hidden">
                <p className="text-sm font-medium text-slate-800 capitalize line-clamp-1"
                >
                  {user?.name}
                </p>
                <p
                  className="text-xs text-slate-400 text-[11px] capitalize line-clamp-1"
                >
                  {user?.role}
                </p>
              </div>
              {profileOpen && (
                <>
                  <div className="absolute right-0 mt-45 bg-white shadow-xl rounded-lg py-2 w-44 animate-[fadeIn_.2s_ease]">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                    >
                      <p className="px-4 py-2 text-slate-600 hover:bg-gray-100 cursor-pointer">
                        Profile
                      </p>
                    </Link>


                    <p
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    >
                      Logout
                    </p>
                  </div>
                  <i className="ri-triangle-fill text-white text-4xl absolute top-10 right-6 animate-[fadeIn_.2s_ease]"></i>
                </>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      <OverlayModal
        onClose={() => setIsLogoutModalOpen(false)}
        isOpen={isLogoutModalOpen}
        showCloseIcon={false}
        modalClass="w-lg"
      >
        <LogoutModal
          onCancel={() => setIsLogoutModalOpen(false)}
          onConfirm={() => handleLogoutConfirm()}
        />
      </OverlayModal>
    </>
  );
}