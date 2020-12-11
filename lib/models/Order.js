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

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM orders 
      WHERE id=$1`, [id]
    );

    if(!rows[0]) throw new Error(`No order with id ${id}`);
    return new Order(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM orders'
    );

    return rows.map(row => new Order(row));
  }

  static async update(id, { item, itemPrice }) {
    const { rows } = await pool.query(
      'UPDATE orders SET item=$1, item_price=$2, customer_id=$3 WHERE id=$3 RETURNING *', [item, itemPrice, id]
    );

    if(!rows[0]) throw new Error(`No order with id ${id}`);
    return new Order(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM orders WHERE id=$1 RETURNING *', [id]
    );

    if(!rows[0]) throw new Error(`No order with id ${id}`);
    return new Order(rows[0]);
  }
};
