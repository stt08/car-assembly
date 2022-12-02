const { Users } = require('../api/users.js');

describe('Basic Mongo Operations', () => {
    let id;
    let name = 'Jest testing basic';
    let role = 'admin';
    let secret = '123456';

    test('getAll', async () => {
        const users = await Users.getAll();
        expect(users).toBeInstanceOf(Array);
    });

    test('add', async () => {
        const user = await Users.add({name, role, secret});
        expect(user).toBeDefined();
        expect(user.status).toBe(200);
        expect(user.message).not.toBe("Unable to post data");
        id = user.message;
    });

    test('get', async () => {
        const user = await Users.get(id);
        expect(user).toBeDefined();
        expect(user.name).toBe(name);
        expect(user.role).toBe(role);
        expect(user.secret).toBe(secret);
        expect(user).toBeInstanceOf(Object);
    });

    test('update', async () => {
        let new_name = 'Jest testing UPDATED';
        let new_role = 'user';
        let new_secret = '654321';

        const user = await Users.update(id, {name: new_name, role: new_role, secret: new_secret});
        expect(user).toBeDefined();
        expect(user.status).toBe(200);
        expect(user.message).toBe("OK");

        const updated_user = await Users.get(id);
        expect(updated_user).toBeDefined();
        expect(updated_user.name).toBe(new_name);
        expect(updated_user.role).toBe(new_role);
        expect(updated_user.secret).toBe(new_secret);
    });

    test('delete', async () => {
        const user = await Users.delete(id);
        expect(user).toBeDefined();
        expect(user.status).toBe(200);
        expect(user.message).toBe("OK");
    });
});

describe('Error handling', () => {
    let name = 'Jest testing error handling';
    let role = 'products';
    let secret = '123456';

    test('empty name', async () => {
        const user = await Users.add({name: "", role, secret});
        expect(user).toBeDefined();
        expect(user.status).toBe(400);
        expect(user.message).toBe("Incorrect data");
    });

    test('empty role', async () => {
        const user = await Users.add({name, role: "", secret});
        expect(user).toBeDefined();
        expect(user.status).toBe(400);
        expect(user.message).toBe("Incorrect data");
    });

    test('empty secret', async () => {
        const user = await Users.add({name, role, secret: ""});
        expect(user).toBeDefined();
        expect(user.status).toBe(400);
        expect(user.message).toBe("Incorrect data");
    });    
});

describe('Not Existing Elements', () => {
    let nonexistingId = "000000000000000000000000000000000000000000000000"

    test('delete non-existing', async () => {
        const user = await Users.delete(nonexistingId);
        expect(user).toBeDefined();
        expect(user.status).toBe(400);
        expect(user.message).toBe("Unable to delete data");
    });

    test('get non-existing', async () => {
        const user = await Users.get(nonexistingId);
        expect(user).toBeDefined();
        expect(user).toBe(Users.empty);
    });

    test('update non-existing', async () => {
        const user = await Users.update(nonexistingId, {name:"1", role:"2", secret:"3"});
        expect(user).toBeDefined();
        expect(user.status).toBe(400);
        expect(user.message).toBe("Unable to update data");
    });
});