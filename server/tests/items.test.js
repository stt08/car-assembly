const { Items } = require('../api/items.js');

describe('Basic Mongo Operations', () => {
    let id;
    let name = 'Jest testing basic';
    let amount = 10;

    test('getAll', async () => {
        const items = await Items.getAll();
        expect(items).toBeInstanceOf(Array);
    });

    test('add', async () => {
        const item = await Items.add({name, amount});
        expect(item).toBeDefined();
        expect(item.status).toBe(200);
        expect(item.message).not.toBe("Unable to post data");
        id = item.message;
    });

    test('get', async () => {
        const item = await Items.get(id);
        expect(item).toBeDefined();
        expect(item.name).toBe(name);
        expect(item.amount).toBe(amount);
        expect(item).toBeInstanceOf(Object);
    });

    test('update', async () => {
        let new_name = 'Jest testing UPDATED';
        let new_amount = 20;

        const item = await Items.update(id, {name: new_name, amount: new_amount});
        expect(item).toBeDefined();
        expect(item.status).toBe(200);
        expect(item.message).toBe("OK");

        const updated_item = await Items.get(id);
        expect(updated_item).toBeDefined();
        expect(updated_item.name).toBe(new_name);
        expect(updated_item.amount).toBe(new_amount);
    });

    test('delete', async () => {
        const item = await Items.delete(id);
        expect(item).toBeDefined();
        expect(item.status).toBe(200);
        expect(item.message).toBe("OK");
    });
});

describe('Error handling', () => {
    test('empty name', async () => {
        const item = await Items.add({name: "", amount: 10});
        expect(item).toBeDefined();
        expect(item.status).toBe(400);
        expect(item.message).toBe("Incorrect data");
    });

    test('empty amount', async () => {
        const item = await Items.add({name: "Jest testing errors", amount: ""});
        expect(item).toBeDefined();
        expect(item.status).toBe(400);
        expect(item.message).toBe("Incorrect data");
    });

    test('zero as amount', async () => {
        const item = await Items.add({name: "Jest testing errors", amount: 0});
        expect(item).toBeDefined();
        expect(item.status).toBe(400);
        expect(item.message).toBe("Incorrect data");
    });

    test('negative amount', async () => {
        const item = await Items.add({name: "Jest testing errors", amount: -1});
        expect(item).toBeDefined();
        expect(item.status).toBe(400);
        expect(item.message).toBe("Incorrect data");
    });

    test('non-numeric amount', async () => {
        const item = await Items.add({name: "Jest testing errors", amount: "abc"});
        expect(item).toBeDefined();
        expect(item.status).toBe(400);
        expect(item.message).toBe("Incorrect data");
    });
});

describe('Not Existing Elements', () => {
    let nonexistingId = "000000000000000000000000000000000000000000000000"

    test('delete non-existing', async () => {
        const item = await Items.delete(nonexistingId);
        expect(item).toBeDefined();
        expect(item.status).toBe(400);
        expect(item.message).toBe("Unable to delete data");
    });

    test('get non-existing', async () => {
        const item = await Items.get(nonexistingId);
        expect(item).toBeDefined();
        expect(item).toBe(Items.empty);
    });

    test('update non-existing', async () => {
        const user = await Items.update(nonexistingId, {name:"1", amount:1});
        expect(user).toBeDefined();
        expect(user.status).toBe(400);
        expect(user.message).toBe("Unable to update data");
    });
});