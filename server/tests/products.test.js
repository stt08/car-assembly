const { Products } = require('../api/products.js');

describe('Basic Mongo Operations', () => {
    let id;
    let name = 'Jest testing basic';
    let price = 100;
    let amount = 10;
    let status = 'available';

    test('getAll', async () => {
        const products = await Products.getAll();
        expect(products).toBeInstanceOf(Array);
    });

    test('add', async () => {
        const product = await Products.add({ name, price, amount, status });
        expect(product).toBeDefined();
        expect(product.status).toBe(200);
        expect(product.message).not.toBe("Unable to post data");
        id = product.message;
    });

    test('get', async () => {
        const product = await Products.get(id);
        expect(product).toBeDefined();
        expect(product.name).toBe(name);
        expect(product.price).toBe(price);
        expect(product.amount).toBe(amount);
        expect(product).toBeInstanceOf(Object);
    });

    test('update', async () => {
        let new_name = 'Jest testing UPDATED';
        let new_price = 200;
        let new_amount = 20;
        let new_status = 'unavailable';

        const product = await Products.update(id, {name: new_name, price: new_price, amount: new_amount, status: new_status});
        expect(product).toBeDefined();
        expect(product.status).toBe(200);
        expect(product.message).toBe("OK");

        const updated_product = await Products.get(id);
        expect(updated_product).toBeDefined();
        expect(updated_product.name).toBe(new_name);
        expect(updated_product.price).toBe(new_price);
        expect(updated_product.amount).toBe(new_amount);
        expect(updated_product.status).toBe(new_status);
    });

    test('delete', async () => {
        const product = await Products.delete(id);
        expect(product).toBeDefined();
        expect(product.status).toBe(200);
        expect(product.message).toBe("OK");
    });
});

describe('Error handling', () => {
    let name = 'Jest testing error handling';
    let price = 100;
    let amount = 10;
    let status = 'available';

    test('empty name', async () => {
        const product = await Products.add({name: "", price, amount, status});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Incorrect data");
    });

    test('empty price', async () => {
        const product = await Products.add({name, price: "", amount, status});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Incorrect data");
    });
    
    test('empty amount', async () => {
        const product = await Products.add({name, price, amount: "", status});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Incorrect data");
    });

    test('empty status', async () => {
        const product = await Products.add({name, price, amount, status: ""});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Incorrect data");
    });

    test('negative price', async () => {
        const product = await Products.add({name, price: -100, amount, status});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Incorrect data");
    });

    test('negative amount', async () => {
        const product = await Products.add({name, price, amount: -10, status});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Incorrect data");
    });

    test('zero as price', async () => {
        const product = await Products.add({name, price: 0, amount, status});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Incorrect data");
    });

    test('zero as amount', async () => {
        const product = await Products.add({name, price, amount: 0, status});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Incorrect data");
    });
});

describe('Not Existing Elements', () => {
    let nonexistingId = "000000000000000000000000000000000000000000000000"

    test('delete non-existing', async () => {
        const product = await Products.delete(nonexistingId);
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Unable to delete data");
    });

    test('get non-existing', async () => {
        const product = await Products.get(nonexistingId);
        expect(product).toBeDefined();
        expect(product).toBe(Products.empty);
    });

    test('update non-existing', async () => {
        const product = await Products.update(nonexistingId, {name:"1", price:1, amount:1, status:"available"});
        expect(product).toBeDefined();
        expect(product.status).toBe(400);
        expect(product.message).toBe("Unable to update data");
    });
});