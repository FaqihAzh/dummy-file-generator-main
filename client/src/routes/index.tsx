import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import DummyFileGeneratorPage from "../pages/DummyFileGenerator";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/dummy-file-generator',
    element: <DummyFileGeneratorPage />,
  },
  {
    path: "*",
    element: <h1 className="p-8">404 – halaman tidak ditemukan</h1>,
  },
]);