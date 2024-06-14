const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    destroyReservation
} = require('./db'); // import the default export from db.js
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/customers', async (req, res, next) => {
    try {
        res.send(await fetchCustomers());
    } catch (error) {
        next(error);
    }
});

app.get('/api/restaurants', async (req, res, next) => {
    try {
        res.send(await fetchRestaurants());
    } catch (error) {
        next(error);
    }
});

app.get('/api/reservations', async (req, res, next) => {
    try {
        res.send(await fetchReservations());
    } catch (error) {
        next(error);
    }
});

app.post('/api/customers/:customer_id/reservations', async (req, res, next) => {
    try {
        res.status(201).send(await createReservation({ customer_id: req.params.customer_id, restaurant_id: req.body.restaurant_id, date: req.body.date, party_count: req.body.party_count }));
    } catch (error) {
        next(error);
    }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
    try {
        await destroyReservation({ id: req.params.id, customer_id: req.params.customer_id });
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ error: err.message || err });
});

const init = async () => {
    console.log('connecting to the database');
    await client.connect();
    console.log('connected to the database');
    await createTables();
    console.log('created tables');
    const [Moe, Lucy, Curly, Ethyl, Dominoes, Ceasars, Papas, Hooks] = await Promise.all([
        createCustomer({ name: 'Moe' }),
        createCustomer({ name: 'Lucy' }),
        createCustomer({ name: 'Curly' }),
        createCustomer({ name: 'Ethyl' }),
        createRestaurant({ name: 'Dominoes' }),
        createRestaurant({ name: 'Ceasars' }),
        createRestaurant({ name: 'Papas' }),
        createRestaurant({ name: 'Hooks' }),
    ]);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());

    const [reservation1, reservation2, reservation3, reservation4] = await Promise.all([
        createReservation({ customer_id: Moe.id, restaurant_id: Dominoes.id, date: '2024-08-01', party_count: 2 }),
        createReservation({ customer_id: Lucy.id, restaurant_id: Ceasars.id, date: '2024-08-02', party_count: 4 }),
        createReservation({ customer_id: Curly.id, restaurant_id: Papas.id, date: '2024-08-03', party_count: 6 }),
        createReservation({ customer_id: Ethyl.id, restaurant_id: Hooks.id, date: '2024-08-04', party_count: 8 }),
    ]);
    console.log(await fetchReservations());
    await destroyReservation({ id: reservation1.id, customer_id: reservation1.customer_id });
    console.log(await fetchReservations());

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
        console.log(`curl localhost:${PORT}/api/customers`);
        console.log(`curl localhost:${PORT}/api/restaurants`);
        console.log(`curl localhost:${PORT}/api/reservations`);
        console.log(`curl -X POST localhost:${PORT}/api/customers/${Moe.id}/reservations -d '{"restaurant_id": "${Dominoes.id}", "date": "2024-08-01", "party_count": 2}' -H 'Content-Type: application/json'`);
    });
};

init();