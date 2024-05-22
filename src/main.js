const { BrowserWindow, Notification } = require("electron");
const { getConnection } = require("./database");

let window;

const createProduct = async (product) => {
  try {
    const pool = await getConnection();
    product.price = parseFloat(product.price);
    const result = await pool.query("INSERT INTO product SET ?", product);
    product.id = result.insertId;

    // Notify the User
    new Notification({
      title: "Electron Mysql",
      body: "New Product Saved Successfully",
    }).show();

    // Return the created Product
    return product;
  } catch (error) {
    console.log(error);
  }
};

const getProducts = async () => {
  const pool = await getConnection();
  const results = await pool.query("SELECT * FROM product ORDER BY id DESC");
  return results;
};

const deleteProduct = async (id) => {
  const pool = await getConnection();
  const result = await pool.query("DELETE FROM product WHERE id = ?", id);
  return result;
};

const getProductById = async (id) => {
  const pool = await getConnection();
  const result = await pool.query("SELECT * FROM product WHERE id = ?", id);
  return result.rows[0]; // Assuming you want to return the first row of the result
};

const updateProduct = async (id, product) => {
  const pool = await getConnection();
  const result = await pool.query("UPDATE product SET ? WHERE id = ?", [
    product,
    id,
  ]);
  console.log(result);
};

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadFile("src/ui/index.html");
}

module.exports = {
  createWindow,
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  updateProduct
};
