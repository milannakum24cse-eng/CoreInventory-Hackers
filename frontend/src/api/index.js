import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Dashboard
export const getDashboard = () => api.get('/dashboard')

// Products
export const getProducts  = (params) => api.get('/products', { params })
export const getProduct   = (id)     => api.get(`/products/${id}`)
export const createProduct= (data)   => api.post('/products', data)
export const updateProduct= (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct= (id)     => api.delete(`/products/${id}`)
export const adjustStock  = (id, data) => api.post(`/products/${id}/stock`, data)
export const getMovements = (id)     => api.get(`/products/${id}/movements`)

// Categories
export const getCategories  = ()         => api.get('/categories')
export const createCategory = (data)     => api.post('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id)       => api.delete(`/categories/${id}`)

// Suppliers
export const getSuppliers  = ()         => api.get('/suppliers')
export const createSupplier= (data)     => api.post('/suppliers', data)
export const updateSupplier= (id, data) => api.put(`/suppliers/${id}`, data)
export const deleteSupplier= (id)       => api.delete(`/suppliers/${id}`)
