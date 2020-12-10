const express = require('express');
const Customer = require('./models/Customer');
const app = express();

app.use(express.json());

//endpoints
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
