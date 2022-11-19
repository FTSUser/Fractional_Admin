/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "../app/Routes";
import { ToastContainer } from "react-toastify";

// import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";

export default function App() {
  return (
    <React.Suspense fallback={<LayoutSplashScreen />}>
      <BrowserRouter>
        <MaterialThemeProvider>
          {/* <I18nProvider> */}
          <ToastContainer />
          <Routes />
          {/* </I18nProvider> */}
        </MaterialThemeProvider>
      </BrowserRouter>
    </React.Suspense>
  );
}
