import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from './pages/Layout';
import Home from './pages/Home';
import GetToken from './pages/GetToken';
import Weight from './pages/Weight';
import NoPage from './pages/NoPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route  path="/get-token" element={<GetToken />} />
        <Route  path="/weight" element={<Weight />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
