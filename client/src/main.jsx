// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { AppContextProvider } from "./context/AppContext.jsx";
// import { BrowserRouter } from "react-router-dom";

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <AppContextProvider>
//       <App />
//     </AppContextProvider>
//   </BrowserRouter>
// );

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </BrowserRouter>
);