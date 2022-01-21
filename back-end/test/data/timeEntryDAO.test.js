const t = require('tap');
const testdb = require('../testutils/testdb');

const TimeEntryDAO = require('../../src/data/timeEntryDAO');

t.before(async () => {
    await testdb.connect();
});

t.beforeEach(async t => {
    await testdb.clearDatabase();
    t.dao = new TimeEntryDAO();
});

t.teardown(async () => {
    await testdb.closeDatabase();
});

t.test('getAll() returns correct number of TimeEntries for a user', async t => {
    await t.dao.add(0, 0, 0, 1);
    await t.dao.add(0, 0, 2, 3);
    let entries = await t.dao.getAll(0);
    t.equal(entries.length, 2);
    t.end();
});

t.test('getPaginated() returns days in descending order', async t => {
    for(let i = 0; i < 10; i++) {
        await t.dao.add(0, 0, i * (1000 * 60 * 60 * 24), i * (1000 * 60 * 60 * 24) + 10);
    }

    let result = await t.dao.getPaginated(0);
    t.equal(result.length, 5);

    let lastStart = result[0].entries[0].start;
    for(let i = 1; i < result.length; i++) {
        t.equal(result[i].entries.length, 1);
        t.ok(result[i].entries[0].start < lastStart);
        lastStart = result[i].entries[0].start;
    }

    result = await t.dao.getPaginated(0, 5, new Date(result[4].entries[0].start));
    t.equal(result.length, 5);

    lastStart = result[0].entries[0].start;
    for(let i = 1; i < result.length; i++) {
        t.equal(result[i].entries.length, 1);
        t.ok(result[i].entries[0].start < lastStart);
        lastStart = result[i].entries[0].start;
    }

    t.end();
});