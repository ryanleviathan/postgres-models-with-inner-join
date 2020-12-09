const pool = require('../utils/pool');
const Customer = require('./Customer');

module.exports = class Order {
  id;
  item;
  price;

  constructor(row) {
    this.id = row.id;
    this.item = row.item;
    this.price = row.price;
  }

  static async insert({ item, price }) {
    const { rows } = await pool.query(
      'INSERT INTO orders (item, price) VALUES ($1, $2) RETURNING *',
      [item, price]
    );

    return new Order(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT
        orders.*,
        array_to_json(array_agg(customers.*)) AS customers
      FROM
        orders
      JOIN customers
      ON orders.id = customers.order_id
      WHERE orders.id=$1
      GROUP BY orders.id`,
      [id]
    );

    if(!rows[0]) throw new Error(`No order with id #${id} found. Please contact customer service at 1(800) 800-8000 with any questions`);

    return {
      ...new Order(rows[0]),
      customers: rows[0].customers.map(customer => new Customer(customer))
    };
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM orders'
    );
    return rows.map(row => new Order(row));
  }

  static async update(id, { item, price }) {
    const { rows } = await pool.query(
      `UPDATE orders
        SET item=$1
            price=$2
        WHERE id=$3
        RETURNING *`,
      [item, price, id]
    );
    
    if(!rows[0]) throw new Error(`No order with id #${id} found. Please contact customer service at 1(800) 800-8000 with any questions`);
    
    return new Order(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM order WHERE id=$1 RETURNING *',
      [id]
    );

    return new Order(rows[0]);
  }
};
