import React, { Children, createContext, useContext, useState } from "react";
import { userProfileData } from "../data/dummy";
import { UserProfile } from "../components";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);

  const [isClicked, setIsClicked] = useState(initialState);

  return (
    <StateContext.Provider value={{ activeMenu, setActiveMenu, isClicked, setIsClicked }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
