"use client";
import { SideBarData } from "../../config/SideBarData";
import NavigationLink from "./NavigationLink";
import { useSelector, useDispatch } from "react-redux";
import OverlayModal from "../common/OverlayModal";
import { useState, useEffect } from "react";
import { LogoutModal } from "../common/LogoutModal";
import { logout } from "../redux/slice/auth-slice";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SideBar = ({ isMobile = false, isOpen = true, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleLogoutConfirm = async () => {
    await dispatch(logout());
    setIsLogoutModalOpen(false);
    router.replace("/auth/signin");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[270px] md:w-[300px] lg:w-[18.75%]
         sidebar-gradient
          text-white
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 
        `}
      >
        <nav className="h-full flex flex-col">
          <div className="absolute -top-11 -right-20 w-34 h-34 rounded-full opacity-10 pointer-events-none circle" ></div>


          <div className="flex items-center gap-3 p-5 border-b border-white/15 ">
            <Link href="/">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg logo">
                <i className="ri-flashlight-line text-xl"></i>
              </div>
            </Link>
            <div>
              <h1 className="text-[16px] font-bold">VocaRent</h1>
              <p className="text-[11px] text-blue-200/60 line-clamp-1">
                AI-Based Rent Management
              </p>
            </div>

          </div>

          <ul className="relative flex-1 p-3 space-y-0.5 overflow-y-auto">

            {SideBarData.map((section, index) => (
              <div key={index}>

                <p className="px-3 py-2 text-blue-300/60 uppercase tracking-widest text-[10px] font-semibold">
                  {section.section}
                </p>

                <div className="mt-1 space-y-2 ">
                  {section.items.map((item, i) => (
                    <NavigationLink key={i} {...item} />
                  ))}
                </div>

              </div>
            ))}

          </ul>

          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-3 cursor-pointer">
            <div className="rounded-xl px-3 py-2 flex items-center justify-between gap-3 logout" >
              <div className="flex items-center gap-3">
                <div className="block logout-bg w-8 h-8 rounded-full flex items-center justify-center  "  >
                <span className="text-white text-sm font-bold capitalize">{user?.name?.charAt([0])}</span>
              </div>
              <div className="max-w-20">
                <p className="text-white text-sm font-medium truncate capitalize line-clamp-1" >{user?.name}</p>
                <p className="text-blue-200/60 truncate text-[11px] line-clamp-1">{user?.mobile}</p>
              </div>
              </div>
              <i className="ri-logout-circle-r-line text-red-100 text-xl"></i>
            </div>
          </div>
        </nav>
      </aside>
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
};

export default SideBar;