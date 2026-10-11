"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "@/components/redux/slice/auth-slice";
import ProfileHeader from "./ProfileHeader";


const MainProfile = () => {
  const dispatch = useDispatch();

  const { user, userLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  if (userLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />
    </div>
  );
};

export default MainProfile;