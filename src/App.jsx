import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ThemeProvider from './context/ThemeContext'
import StoreProvider from './context/StoreContext'
import AuthProvider from './context/AuthContext'
import CartProvider from './context/CartContext'
import ToastProvider from './context/ToastContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import OrderDetail from './pages/OrderDetail'
import Admin from './pages/Admin'
import Login from './pages/Login'
import AccessDenied from './pages/AccessDenied'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <StoreProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="productos" element={<Products />} />
                    <Route path="productos/:id" element={<ProductDetail />} />
                    <Route path="carrito" element={<Cart />} />
                    <Route path="login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="perfil" element={<Profile />} />
                      <Route path="perfil/pedidos/:id" element={<OrderDetail />} />
                    </Route>
                    <Route element={<ProtectedRoute role="admin" />}>
                      <Route path="admin" element={<Admin />} />
                    </Route>
                    <Route path="acceso-denegado" element={<AccessDenied />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </StoreProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
