const pool = require('../utils/pool');

module.exports = class Customer {
  id;
  orderId;

  constructor(row) {
    this.id = String(row.id);
    this.orderId = String(row.order_id);
  }

  static async insert({ orderId }) {
    const { rows } = await pool.query(
      'INSERT INTO customers (orderId) VALUEs ($1) RETURNING *',
      [orderId]
    );

    return new Customer(rows[0]); 
  }
};
