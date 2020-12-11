const express = require('express');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const app = express();

app.use(express.json());

//endpoints orders
app.post('/api/v1/orders', (req, res) => {
  Order
    .insert(req.body)
    .then(order => res.send(order));
});

app.get('/api/v1/orders', (req, res) => {
  Order
    .find()
    .then(orders => res.send(orders));
});

app.get('/api/v1/orders/:id', (req, res) => {
  Order
    .findById(req.params.id)
    .then(order => res.send(order));
});

app.put('/api/v1/orders/:id', (req, res) => {
  Order
    .update(req.params.id, req.body)
    .then(order => res.send(order));
});

app.delete('/api/v1/orders/:id', (req, res) => {
  Order
    .delete(req.params.id)
    .then(order => res.send(order));
});

//endpoints customers
app.post('/api/v1/customers', (req, res) => {
  Customer
    .insert(req.body)
    .then(customer => res.send(customer));
});

app.get('/api/v1/customers', (req, res) => {
  Customer
    .find()
    .then(customers => res.send(customers));
});

app.get('/api/v1/customers/:id', (req, res) => {
  Customer
    .findById(req.params.id)
    .then(customer => res.send(customer));
});

app.put('/api/v1/customers/:id', (req, res) => {
  Customer
    .update(req.params.id, req.body)
    .then(customer => res.send(customer));
});

app.delete('/api/v1/customers/:id', (req, res) => {
  Customer
    .delete(req.params.id)
    .then(customer => res.send(customer));
});

module.exports = app;
