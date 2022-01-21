const t = require('tap');

var mongoose = require('mongoose');
const testdb = require('../testutils/testdb');

const DAO = require('../../src/data/DAO');

const TEST_SCHEMA = new mongoose.Schema({
    field1: {type: String},
    field2: {type: Number}
});

const DUMMY_DATA = [
    {
        field1: 'TEST',
        field2: 0
    },
    {
        field1: 'TEST 1',
        field2: 1
    },
    {
        field1: 'TEST 2',
        field2: 0
    }
]

const TEST_MODEL = mongoose.model('test', TEST_SCHEMA);

t.before(async () => {
    await testdb.connect();
});

t.beforeEach(async t => {
    await testdb.clearDatabase();
    t.dao = DAO.create(TEST_MODEL);
});

t.teardown(async () => {
    await testdb.closeDatabase();
});

t.test('create() creates a DAO object for a given schema', async t => {
    t.type(t.dao, DAO);
    t.same(t.dao.schema, TEST_MODEL);
});

t.test('add() and get() add and fetch documents', async t => {
    let added = [];

    for(let doc of DUMMY_DATA) {
        let result = null;
        await t.resolves(async () => {result = await t.dao.add(doc)});
        t.ok(result);
        added.push(result);
    }

    t.equal(added.length, DUMMY_DATA.length);

    for(let i = 0; i < DUMMY_DATA.length; i++) {
        let res = await t.dao.get(added[i]._id);

        // Documents returned with mongoose should have a toJSON function
        t.match(res, {toJSON: Function});
        res = res.toJSON();

        t.equal(res.field1, DUMMY_DATA[i].field1);
        t.equal(res.field2, DUMMY_DATA[i].field2);
    }
});

t.test('all() gets all documents with a given field', async t => {
    for(let doc of DUMMY_DATA) {
        await t.dao.add(doc);
    }

    let results = [];

    await t.resolves(async () => {results = await t.dao.all(0, 'field2')});

    // There are 2 records in dummy_data where field2 = 0
    t.equal(results.length, 2);
    
    for(let i = 0; i < 2; i++) {
        t.equal(results[i].field2, 0);
    }
});

t.test('remove() removes a document with a given ID', async t => {
    let added = [];
    for(let doc of DUMMY_DATA) {
        added.push(await t.dao.add(doc));
    }

    let expected_amt = 3;
    let remaining = await t.dao.all();
    t.equal(remaining.length, expected_amt);

    for(let doc of added) {
        await t.resolves(t.dao.remove(doc._id));
        expected_amt -= 1;

        remaining = await t.dao.all();
        t.equal(remaining.length, expected_amt);
    }
});

t.test('update() updates a documents fields', async t => {
    let doc = await t.dao.add(DUMMY_DATA[0]);

    // Clone DUMMY_DATA to avoid changing it.
    let updated_data = JSON.parse( JSON.stringify(DUMMY_DATA[0]) )
    updated_data.field1 = "I WAS CHANGED!";

    await t.resolves(t.dao.update(doc._id, updated_data));
    doc = await t.dao.get(doc._id);

    t.equal(doc.field1, "I WAS CHANGED!");
});

t.test('update() does not add new fields', async t => {
    let doc = await t.dao.add(DUMMY_DATA[0]);

    let updated_data = DUMMY_DATA[0];
    updated_data.field3 = "I WAS ADDED!";

    await t.resolves(t.dao.update(doc._id, updated_data));
    doc = await t.dao.get(doc._id);

    t.equal(doc.field1, 'TEST');
    t.equal(doc.field2, 0);
    t.notMatch(doc, {field3: String});
    t.notOk(doc.field3);
});