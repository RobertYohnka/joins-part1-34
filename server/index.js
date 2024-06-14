const { client } = require('./db'); // import the default export from db.js

const init = async () => {
    console.log('connecting to the database');
    await client.connect();
    console.log('connected to the database');
    await createTables();
    console.log('created tables');
    const [moe, lucy, curly, dominoes, ceasars, papas, hooks] = await Promise.all([
        createCustomer({ name: 'Moe' }),
        createCustomer({ name: 'Lucy' }),
        createCustomer({ name: 'Curly' }),
        createRestaurant({ name: 'dominoes' }),
        createRestaurant({ name: 'ceasars' }),
        createRestaurant({ name: 'papas' }),
    ]);
};

init();