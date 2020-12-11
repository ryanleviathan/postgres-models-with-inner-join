const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');
const Customer = require('../lib/models/Customer');

describe('postgres-models-with-inner-join routes', () => {
  
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new customer via post', async() => {
    const res = await request(app)
      .post('/api/v1/customers')
      .send({
        customerName: 'Paul Atreides',
      });

    expect(res.body).toEqual({
      id: '1',
      customerName: 'Paul Atreides'
    });
  });

  it('finds a customer by id and their associated orders', async() => {
    const customer = await Customer.insert({
      customerName: 'Paul Atreides',
    });

    const orders = await Promise.all([
      { item: 'Xbox Series X', itemPrice: 499.99, customerId: customer.id },
      { item: 'Cyberpunk 2077', itemPrice: 59.99, customerId: customer.id },
      { item: 'Seagate Storage Expansion Card', itemPrice: 219.99, customerId: customer.id }
    ].map(order => Order.insert(order)));

    const res = await request(app)
      .get(`/api/v1/customers/${customer.id}`);

    expect(res.body).toEqual({
      ...customer,
      orders: expect.arrayContaining(orders)
    });
  });

  it('finds all customers', async() => {
    const customers = await Promise.all([
      { customerName: 'Leo Atreides' },
      { customerName: 'Lady Jessica' },
      { customerName: 'Paul Atreides' }
    ].map(customer => Customer.insert(customer)));

    const res = await request(app)
      .get('/api/v1/customers');

    expect(res.body).toEqual(expect.arrayContaining(customers));
    expect(res.body).toHaveLength(customers.length);
  });

  it('updates a customer', async() => {
    const customer = await Customer.insert({
      customerName: 'Duncan Idaho'
    });

    const res = await request(app)
      .put(`/api/v1/customers/${customer.id}`)
      .send({
        customerName: 'Duncan Idaho Clone #3612'
      });

    expect(res.body).toEqual({
      id: customer.id,
      customerName: 'Duncan Idaho Clone #3612'
    });
  });

  it('deletes a customer', async() => {
    const customer = await Customer.insert({
      customerName: 'Duncan Idaho Clone #3612'
    });

    const res = await request(app)
      .delete(`/api/v1/customers/${customer.id}`);

    expect(res.body).toEqual(customer);
  });

  it('creates a new order', async() => {
    const customer = await Customer.insert({
      customerName: 'Duncan Idaho'
    });
    
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        item: 'Xbox Series X',
        itemPrice: 499.99,
        customerId: customer.id 
      });

    expect(res.body).toEqual({
      id: '1',
      item: 'Xbox Series X',
      itemPrice: 499.99,
      customerId: customer.id
    });
  });

  it('finds a order by id', async() => {
    const customer = await Customer.insert({
      customerName: 'Duncan Idaho'
    });
    
    const order = await Order.insert({
      item: 'Xbox Series X',
      itemPrice: 499.99,
      customerId: customer.id
    });

    const res = await request(app)
      .get(`/api/v1/orders/${order.id}`);

    expect(res.body).toEqual({
      id: '1',
      item: 'Xbox Series X',
      itemPrice: 499.99,
      customerId: customer.id
    });
  });

  it('finds all orders', async() => {
    const customer = await Customer.insert({
      customerName: 'Duncan Idaho'
    });
    
    const orders = await Promise.all([
      { item: 'Xbox Series X', itemPrice: 499.99, customerId: customer.id },
      { item: 'Cyberpunk 2077', itemPrice: 59.99, customerId: customer.id },
      { item: 'Seagate Storage Expansion Card', itemPrice: 219.99, customerId: customer.id }
    ].map(order => Order.insert(order)));

    const res = await request(app)
      .get('/api/v1/orders');

    expect(res.body).toEqual(expect.arrayContaining(orders));
    expect(res.body).toHaveLength(orders.length);
  });

  it('updates a order by id', async() => {
    const customer = await Customer.insert({
      customerName: 'Duncan Idaho'
    });
    
    const order = await Order.insert({
      item: 'Xbox Series X',
      itemPrice: 499.99,
      customerId: customer.id
    });
    
    const res = await request(app)
      .put(`/api/v1/orders/${order.id}`)
      .send({
        item: 'Xbox Series S',
        itemPrice: 299.99,
        customerId: customer.id
      });

    expect(res.body).toEqual({
      id: '1',
      item: 'Xbox Series S',
      itemPrice: 299.99,
      customerId: customer.id
    });
  });

  it('deletes a order by id', async() => {
    const customer = await Customer.insert({
      customerName: 'Duncan Idaho'
    });
    
    const order = await Order.insert({
      item: 'Xbox Series S',
      itemPrice: 299.99,
      customerId: customer.id
    });
    
    const res = await request(app)
      .delete(`/api/v1/orders/${order.id}`);

    expect(res.body).toEqual(order);
  });  
});
