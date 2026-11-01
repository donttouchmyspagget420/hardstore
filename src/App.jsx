import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import ToastProvider from './context/ToastContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Admin from './pages/Admin'
import Login from './pages/Login'
import AccessDenied from './pages/AccessDenied'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="productos" element={<Products />} />
              <Route path="productos/:id" element={<ProductDetail />} />
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="admin" element={<Admin />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="acceso-denegado" element={<AccessDenied />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
