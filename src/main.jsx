import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ContentProvider } from "@/lib/content-store";
import { AuthProvider } from "@/lib/admin-auth";
import "./styles.css";

const router = createRouter({ routeTree });

const rootElement = document.getElementById("root");
if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ContentProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ContentProvider>,
  );
}
