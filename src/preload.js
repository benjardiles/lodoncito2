const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProducts: () => ipcRenderer.invoke('get-products'),
  createProduct: (product) => ipcRenderer.invoke('create-product', product),
  updateProduct: (id, product) => ipcRenderer.invoke('update-product', id, product),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  getProductById: (id) => ipcRenderer.invoke('get-product-by-id', id),
  changeProductQuantity: (id, change) => ipcRenderer.invoke('change-product-quantity', id, change),
  getProviders: () => ipcRenderer.invoke('get-providers'),
  openProvidersWindow: () => ipcRenderer.send('open-providers-window'),
  getConsumption: () => ipcRenderer.invoke('get-consumption')
});
