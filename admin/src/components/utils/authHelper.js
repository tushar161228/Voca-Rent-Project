import Cookies from "js-cookie";

// SAVE TOKEN
export const setAuthCookies = (token) => {
  if (token) {
    Cookies.set("token", token, {
      expires: 6,
      path: "/",
      sameSite: "strict",
    });
  }
};

// REMOVE TOKEN
export const clearAuthCookies = () => {
  Cookies.remove("token", {
    path: "/",
  });
};