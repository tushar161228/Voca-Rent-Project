"use client";

import React from "react";
import OverlayModal from "@/components/common/OverlayModal";
import { LogOut as LogoutIcon } from "lucide-react";

const LogOut = ({ isOpen, onClose, onConfirm }) => {
    return (
        <OverlayModal
            isOpen={isOpen}
            onClose={onClose}
            showCloseIcon={true}
            modalClass="w-full max-w-md rounded-2xl bg-[#071527] border border-white/10 p-6 text-white"
            showBackdrop={true}
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <LogoutIcon size={30} className="text-red-400" />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                    Logout Account
                </h2>

                <p className="text-gray-400 text-sm">
                    Are you sure you want to logout from your account?
                </p>

                <div className="flex items-center gap-4 mt-8 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </OverlayModal>
    );
};

export default LogOut;