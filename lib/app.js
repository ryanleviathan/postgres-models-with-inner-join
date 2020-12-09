const express = require('express');
const Order = require('./models/Order');
const app = express();

app.use(express.json());

//endpoints
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

module.exports = app;
