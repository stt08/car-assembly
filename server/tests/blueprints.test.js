const { Blueprints } = require('../api/blueprints.js');

describe('Basic Mongo Operations', () => {
    let id;
    let name = 'Jest testing basic';
    let items = [{id: '1', amount: 1}, {id: '2', amount: 2}];

    test('getAll', async () => {
        const blueprints = await Blueprints.getAll();
        expect(blueprints).toBeInstanceOf(Array);
    });

    test('add', async () => {
        const blueprint = await Blueprints.add({name, items});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(200);
        expect(blueprint.message).not.toBe("Unable to post data");
        id = blueprint.message;
    });

    test('get', async () => {
        const blueprint = await Blueprints.get(id);
        expect(blueprint).toBeDefined();
        expect(blueprint.name).toBe(name);
        expect(blueprint.items).toEqual(items);
        expect(blueprint).toBeInstanceOf(Object);
    });

    test('update', async () => {
        let new_name = 'Jest testing UPDATED';
        let new_items = [{id: '3', amount: 3}, {id: '4', amount: 4}];

        const blueprint = await Blueprints.update(id, {name: new_name, items: new_items});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(200);
        expect(blueprint.message).toBe("OK");

        const updated_blueprint = await Blueprints.get(id);
        expect(updated_blueprint).toBeDefined();
        expect(updated_blueprint.name).toBe(new_name);
        expect(updated_blueprint.items).toEqual(new_items);
    });

    test('delete', async () => {
        const blueprint = await Blueprints.delete(id);
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(200);
        expect(blueprint.message).toBe("OK");
    });
});

describe('Error handling', () => {
    let id;
    let name = 'Jest testing errors';
    let items = [{id: '1', amount: 1}, {id: '2', amount: 2}];

    test('empty name', async () => {
        const blueprint = await Blueprints.add({name: "", items});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(400);
        expect(blueprint.message).toBe("Incorrect data");
    });

    test('empty items', async () => {
        const blueprint = await Blueprints.add({name, items: []});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(400);
        expect(blueprint.message).toBe("Incorrect data");
    });

    test('empty item id', async () => {
        const blueprint = await Blueprints.add({name, items: [{id: "", amount: 1}]});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(400);
        expect(blueprint.message).toBe("Incorrect data");
    });

    test('empty item amount', async () => {
        const blueprint = await Blueprints.add({name, items: [{id: "example", amount: ""}]});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(400);
        expect(blueprint.message).toBe("Incorrect data");
    });

    test('zero as item amount', async () => {
        const blueprint = await Blueprints.add({name, items: [{id: "example", amount: 0}]});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(400);
        expect(blueprint.message).toBe("Incorrect data");
    });

    test('negative item amount', async () => {
        const blueprint = await Blueprints.add({name, items: [{id: "example", amount: -1}]});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(400);
        expect(blueprint.message).toBe("Incorrect data");
    });

    test('non-numeric item amount', async () => {
        const blueprint = await Blueprints.add({name, items: [{id: "example", amount: "example"}]});
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(400);
        expect(blueprint.message).toBe("Incorrect data");
    });
});

describe('Not Existing Elements', () => {
    let nonexistingId = "000000000000000000000000000000000000000000000000"

    test('delete non-existing', async () => {
        const blueprint = await Blueprints.delete(nonexistingId);
        expect(blueprint).toBeDefined();
        expect(blueprint.status).toBe(400);
        expect(blueprint.message).toBe("Unable to delete data");
    });

    test('get non-existing', async () => {
        const blueprint = await Blueprints.get(nonexistingId);
        expect(blueprint).toBeDefined();
        expect(blueprint).toBe(Blueprints.empty);
    });

    test('update non-existing', async () => {
        const user = await Blueprints.update(nonexistingId, {name:"1", items: [{id: "1", amount: 1}]});
        expect(user).toBeDefined();
        expect(user.status).toBe(400);
        expect(user.message).toBe("Unable to update data");
    });
});