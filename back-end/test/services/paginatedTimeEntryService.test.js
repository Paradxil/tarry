const t = require('tap');

// Setup database mock
const PaginatedTimeEntryService = t.mock('../../src/services/paginatedTimeEntryService', {
    '../../src/data/timeEntryDAO': {

    }
});

t.beforeEach(async t => {
    t.service = new PaginatedTimeEntryService();
  })

t.test('getPaginatedTimeEntries() returns correct types', async t => {
    let result = await t.service.getPaginatedTimeEntries();

    t.type(result, 'object', 'returns an object');
    t.has(result, {'entries': [], 'last': 0}, 'object has correct fields');
    t.end();
});

t.test('getPaginatedTimeEntries() returns correct number of entries', async t => {
    let result = await t.service.getPaginatedTimeEntries();

    t.type(result, 'object', 'returns an object');
    t.has(result, {'entries': [], 'last': ''}, 'object has correct fields');
    t.end();
});