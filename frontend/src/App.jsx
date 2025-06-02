import Home from './pages/home';
import About from './pages/about';
import Footer from './components/footer';
import Portifolio from './pages/portifolio';
import Adm from './pages/admin';
import Login from './pages/login';
import Projeto from './pages/projeto';
import AddProject from './pages/admin/addProject';
import NotFound from './pages/notFound/notFound.jsx';

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from './components/PrivateRoute.jsx';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/header'; // descomentado

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/Sobre" element={<About />} />
        <Route path="/Portifolio" element={<Portifolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portifolio/:id" element={<Projeto />} />
        <Route path="/Adm" element={
          <PrivateRoute>
            <Adm />
          </PrivateRoute>
        } />
        <Route path="/adm/AdicionarProjeto" element={
          <PrivateRoute>
            <AddProject />
          </PrivateRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}
