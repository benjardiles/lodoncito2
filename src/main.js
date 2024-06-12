const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let providersWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
}

function createProvidersWindow() {
  providersWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  providersWindow.loadFile('providers.html');
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const productsFilePath = path.join(__dirname, 'products.json');
const deletedProductsFilePath = path.join(__dirname, 'deleted_products.json');

function readJSONFile(filePath) {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return [];
}

function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

ipcMain.handle('get-products', async () => {
  return readJSONFile(productsFilePath);
});

ipcMain.handle('create-product', async (event, product) => {
  const products = readJSONFile(productsFilePath);
  product.id = new Date().getTime(); // Generación simple de ID
  products.push(product);
  writeJSONFile(productsFilePath, products);
  return product;
});

ipcMain.handle('get-providers', async () => {
  const providers = [
    { id: 1, nombre: 'Proveedor 1', telefono: '123456789', email: 'proveedor1@example.com', direccion: 'Calle 1' },
    { id: 2, nombre: 'Proveedor 2', telefono: '987654321', email: 'proveedor2@example.com', direccion: 'Calle 2' }
  ];
  return providers;
});

ipcMain.handle('update-product', async (event, id, updatedProduct) => {
  const products = readJSONFile(productsFilePath);
  const productIndex = products.findIndex(product => product.id == id);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    writeJSONFile(productsFilePath, products);
    return products[productIndex];
  }
  return null;
});

ipcMain.handle('delete-product', async (event, id) => {
  const products = readJSONFile(productsFilePath);
  const productIndex = products.findIndex(product => product.id == id);
  let deletedProduct = null;
  if (productIndex !== -1) {
    [deletedProduct] = products.splice(productIndex, 1);
    writeJSONFile(productsFilePath, products);
  }
  
  if (deletedProduct) {
    const deletedProducts = readJSONFile(deletedProductsFilePath);
    deletedProducts.push(deletedProduct);
    writeJSONFile(deletedProductsFilePath, deletedProducts);
  }

  return deletedProduct;
});

ipcMain.handle('get-deleted-products', async () => {
  return readJSONFile(deletedProductsFilePath);
});

ipcMain.handle('restore-product', async (event, id) => {
  const deletedProducts = readJSONFile(deletedProductsFilePath);
  const productIndex = deletedProducts.findIndex(product => product.id == id);
  let restoredProduct = null;
  if (productIndex !== -1) {
    [restoredProduct] = deletedProducts.splice(productIndex, 1);
    writeJSONFile(deletedProductsFilePath, deletedProducts);

    const products = readJSONFile(productsFilePath);
    products.push(restoredProduct);
    writeJSONFile(productsFilePath, products);
  }

  return restoredProduct;
});

ipcMain.handle('get-product-by-id', async (event, id) => {
  const products = readJSONFile(productsFilePath);
  const product = products.find(product => product.id == id);
  return product || null;
});
