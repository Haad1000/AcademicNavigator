import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import {
  Navbar,
  Footer,
  Sidebar,
  ThemeSettings,
  LoginForm,
  SignUpForm,
} from "./components";

import {
  Dashboard,
  Calendar,
  Profile,
  Creators,
  Trello,
} from "./pages";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";

// Layout component
const Layout = ({ children }) => {
  const { activeMenu } = useStateContext();

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <TooltipComponent content="Settings" position="Top">
          <button
            type="button"
            className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
            style={{ background: "#612570", borderRadius: "50%" }}
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div>

      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg bg-white">
          <Sidebar />
        </div>
      )}

      <div
        className={`dark:bg-main-bg bg-main-bg min-h-screen w-full ${
          activeMenu ? "md:ml-72" : "flex-2"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// Component to determine if the layout is needed
const ContentWithLayout = () => {
  const location = useLocation();

  const noLayoutPaths = ["/login", "/signup"];
  const isLayoutNeeded = !noLayoutPaths.includes(location.pathname);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />

      {/* Protected routes */}
      {isLayoutNeeded ? (
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                {/* Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Other pages */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/creators" element={<Creators />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/trello" element={<Trello />} />
                {/* Add more protected routes here */}
              </Routes>
            </Layout>
          }
        />
      ) : (
        <></>
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ContentWithLayout />
    </BrowserRouter>
  );
};

export default App;
