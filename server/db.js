const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || {
    database: 'the_acme_reservation_planner_db',
});

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS reservations;
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurants;
        CREATE TABLE customers (
            id UUID PRIMARY KEY;
            name VARCHAR(50) NOT NULL UNIQUE;
        );
        CREATE TABLE restaurants (
            id UUID PRIMARY KEY;
            name VARCHAR(50) NOT NULL UNIQUE;
        );
        CREATE TABLE reservations (
            id UUID PRIMARY KEY;
            date DATE NOT NULL;
            party_count INTEGER NOT NULL;
            restaurant_id UUID REFERENCES restaurants(id);
            customer_id UUID REFERENCES customers(id);
        );
    `;
    await client.query(SQL);
    return;
}

module.exports = {
    client
};
