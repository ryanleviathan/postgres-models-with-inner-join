const pool = require('../utils/pool');
const Order = require('./Order');

module.exports = class Customer {
  id;
  customerName;

  constructor(row) {
    this.id = String(row.id);
    this.customerName = row.customer_name;
  }

  static async insert({ customerName }) {
    const { rows } = await pool.query(
      'INSERT INTO customers (customer_name) VALUES ($1) RETURNING *',
      [customerName]
    );

    return new Customer(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT
        customers.*,
        array_to_json(array_agg(orders.*)) AS orders
      FROM
        customers
      JOIN orders
      ON customers.id = orders.customer_id
      WHERE customers.id=$1
      GROUP BY customers.id`,
      [id]
    );

    if(!rows[0]) throw new Error(`No order with id #${id} found. Please contact customer service at 1(800) 800-8000 with any questions`);

    return {
      ...new Customer(rows[0]),
      orders: rows[0].orders.map(order => new Order(order))
    };
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM customers'
    );
    return rows.map(row => new Customer(row));
  }

  static async update(id, { customerName }) {
    const { rows } = await pool.query(
      `UPDATE customers
        SET customer_name=$1
        WHERE id=$2
        RETURNING *`,
      [customerName, id]
    );
    
    if(!rows[0]) throw new Error(`No order with id #${id} found. Please contact customer service at 1(800) 800-8000 with any questions`);
    
    return new Customer(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM customers WHERE id=$1 RETURNING *',
      [id]
    );

    return new Customer(rows[0]);
  }
};
