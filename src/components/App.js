import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./dashboard/Dashboard";

function App() {
  return (
    <div>
      <ToastContainer />
      <CssBaseline />
      <Dashboard />
    </div>
  );
}

export default App;
