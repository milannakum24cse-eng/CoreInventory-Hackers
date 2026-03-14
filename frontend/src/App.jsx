import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Suppliers from './pages/Suppliers'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="products"   element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="suppliers"  element={<Suppliers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
