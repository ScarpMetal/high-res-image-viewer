import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ViewerPage from "./pages/ViewerPage";
import Layout from "./components/Layout";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/viewer" element={<ViewerPage />} />
          <Route path="/viewer/:filename" element={<ViewerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
