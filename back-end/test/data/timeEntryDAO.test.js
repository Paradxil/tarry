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

t.test('getPaginated()', async t => {
    // Add 2 entries per day for 9 days in a row
    for(let i = 0; i < 9; i++) {
        await t.dao.add(0, 0, i * (1000 * 60 * 60 * 24), i * (1000 * 60 * 60 * 24) + 10);
        await t.dao.add(0, 0, i * (1000 * 60 * 60 * 24) + 15, i * (1000 * 60 * 60 * 24) + 20);
    }

    // Get first page of results
    let result = await t.dao.getPaginated(0);
    let entries = [];
    result.forEach(el => entries = entries.concat(el.entries));

    t.equal(result.length, 5, 'returns correct number of days');
    t.equal(entries.length, 10, 'returns correct number of entries');

    for(let i = 0; i < result.length; i++) {
        t.equal(result[i].entries.length, 2, 'each day includes the correct number of entries');
    }

    // Check that entries are sorted correctly.
    let lastStart = result[0].entries[0].start;
    for(let i = 1; i < entries.length; i++) {
        t.ok(entries[i].start < lastStart, 'time entries are sorted in descending order from most recent');
        lastStart = entries[i].start;
    }

    // Get second page of results
    result = await t.dao.getPaginated(0, 5, new Date(result[4].entries[1].start));
    entries = [];
    result.forEach(el => entries = entries.concat(el.entries));

    t.equal(result.length, 4, 'returns correct number of days when not full page');
    t.equal(entries.length, 8, 'returns correct number of entries when not full page');

    for(let i = 0; i < result.length; i++) {
        t.equal(result[i].entries.length, 2, 'each day includes the correct number of entries');
    }

    lastStart = result[0].entries[0].start;
    for(let i = 1; i < entries.length; i++) {
        t.ok(entries[i].start < lastStart, 'time entries are sorted in descending order from most recent');
        lastStart = entries[i].start;
    }

    t.end();
});