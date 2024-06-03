const { app, BrowserWindow, Notification, ipcMain } = require('electron');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let mainWindow;

const createProduct = async (product) => {
  try {
    const newProduct = await prisma.licor.create({
      data: {
        nombre: product.nombre,
        tipo: product.tipo,
        marca: product.marca,
        estiloGraduacion: product.estiloGraduacion,
        cantidad: parseInt(product.cantidad),
        stock_critico: parseInt(product.stock_critico),
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
};

const getProducts = async () => {
  try {
    const products = await prisma.licor.findMany();
    console.log({products});
    return products;
  } catch (error) {
    console.error(error);
  }
};

const deleteProduct = async (id) => {
  try {
    await prisma.licor.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error(error);
  }
};

const getProductById = async (id) => {
  try {
    const product = await prisma.licor.findUnique({
      where: { id: id },
    });
    return product;
  } catch (error) {
    console.error(error);
  }
};

const getProviders = async () => {
  try {
    console.log("toy aca")
    const providers = await prisma.proveedor.findMany();
    console.log({providers});
    return providers;
  } catch (error) {
    console.error(error);
  }

}

const updateProduct = async (id, product) => {
  try {
    const updatedProduct = await prisma.licor.update({
      where: { id: id },
      data: product,
    });
    return updatedProduct;
  } catch (error) {
    console.error(error);
  }
};

function createMainWindow() {
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

ipcMain.handle('create-product', async (event, product) => {
  return await createProduct(product);
});

ipcMain.handle('get-products', async () => {
  return await getProducts();
});

ipcMain.handle('delete-product', async (event, id) => {
  return await deleteProduct(id);
});

ipcMain.handle('get-product-by-id', async (event, id) => {
  return await getProductById(id);
});

ipcMain.handle('update-product', async (event, id, product) => {
  return await updateProduct(id, product);
});

ipcMain.handle('get-providers', async () => {
  console.log("toy aca")
  return await getProviders();
});

ipcMain.on('open-providers-window', () => {
  createProvidersWindow();
});

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
