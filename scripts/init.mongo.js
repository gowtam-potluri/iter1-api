
/* global db print */
/* eslint no-restricted-globals: "off" */

db.resissues.remove({});

db.deleted_issues.remove({});

const issuesDB = [
  {
    id: 1,
    available: 'False',
    name: 'Ravan',
    quantity: 5,
    created: new Date('2019-01-15'),
    phone: undefined,
    district: 'Delhi',
    description: 'Oxygen-1',
  },
  {
    id: 2,
    available: 'True',
    name: 'Gowtam',
    quantity: 10,
    created: new Date('2019-01-15'),
    phone: undefined,
    district: 'Delhi-2',
    description: 'Oxygen-2',
  },
];

db.resissues.insertMany(issuesDB);
const count = db.resissues.count();
print('Inserted', count, 'issues');

db.counters.remove({ _id: 'resissues' });
db.counters.insert({ _id: 'resissues', current: count });

db.resissues.createIndex({ id: 1 }, { unique: true });
db.resissues.createIndex({ available: 1 });
db.resissues.createIndex({ name: 1 });
db.resissues.createIndex({ created: 1 });

db.deleted_issues.createIndex({ id: 1 }, { unique: true });