const pool = require('../utils/pool');

module.exports = class Order {
  id;
  item;
  itemPrice;
  customerId;

  constructor(row) {
    this.id = String(row.id);
    this.item = row.item;
    this.itemPrice = row.item_price;
    this.customerId = String(row.customer_id);
  }

  static async insert({ item, itemPrice, customerId }) {
    const { rows } = await pool.query(
      'INSERT INTO orders (item, item_price, customer_id) VALUES ($1, $2, $3) RETURNING *',
      [item, itemPrice, customerId]
    );

    return new Order(rows[0]); 
  }
};
