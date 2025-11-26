import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage";
import DummyFileGeneratorPage from "../pages/DummyFileGenerator";
import YouTubeCrawlerPage from "../pages/YouTubeCrawler";

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
    path: '/youtube-crawler',
    element: <YouTubeCrawlerPage />,
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-zinc-100">404</h1>
          <p className="text-zinc-400">Halaman tidak ditemukan</p>
          <a 
            href="/" 
            className="inline-block mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors"
          >
            Kembali ke Home
          </a>
        </div>
      </div>
    ),
  },
]);