const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('src/ui/index.html');
}

function createProvidersWindow() {
  const providersWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  providersWindow.loadFile('src/ui/providers.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('create-product', async (event, product) => {
  try {
    const newProduct = await prisma.licor.create({
      data: {
        nombre: product.nombre,
        tipo: product.tipo,
        marca: product.marca,
        estiloGraduacion: product.estiloGraduacion,
        cantidad: parseInt(product.cantidad, 10), // Aseguramos que es un entero
        stock_critico: parseInt(product.stock_critico, 10), // Aseguramos que es un entero
        id_proveedor: product.id_proveedor
      },
    });

    new Notification({
      title: "Electron Prisma",
      body: "New Product Saved Successfully",
    }).show();

    return newProduct;
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('get-products', async () => {
  try {
    const products = await prisma.licor.findMany();
    return products;
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('delete-product', async (event, id) => {
  try {
    await prisma.licor.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('get-product-by-id', async (event, id) => {
  try {
    const product = await prisma.licor.findUnique({
      where: { id: id },
    });
    return product;
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('update-product', async (event, id, product) => {
  try {
    const updatedProduct = await prisma.licor.update({
      where: { id: id },
      data: {
        ...product,
        cantidad: parseInt(product.cantidad, 10), // Aseguramos que es un entero
        stock_critico: parseInt(product.stock_critico, 10), // Aseguramos que es un entero
      },
    });
    return updatedProduct;
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('get-providers', async () => {
  try {
    const providers = await prisma.proveedor.findMany();
    return providers;
  } catch (error) {
    console.error(error);
  }
});

ipcMain.on('open-providers-window', () => {
  createProvidersWindow();
});
