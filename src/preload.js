const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  createProduct: (product) => ipcRenderer.invoke('create-product', product),
  getProducts: () => ipcRenderer.invoke('get-products'),
  getProviders: () => ipcRenderer.invoke('get-providers'),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  getProductById: (id) => ipcRenderer.invoke('get-product-by-id', id),
  updateProduct: (id, product) => ipcRenderer.invoke('update-product', id, product),
  openProvidersWindow: () => ipcRenderer.send('open-providers-window')
});
