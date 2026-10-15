import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Workspace } from "./hooks/workspace";
import App from "./App";
import {MobileRuntime} from "./features/mobile/MobileRuntime";
import "./styles.css";
const client = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Workspace>
          <MobileRuntime><App /></MobileRuntime>
        </Workspace>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
