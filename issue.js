const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function patget(_,{ id }){
	const db = getDb();
	const issue = await db.collection('patissues').findOne({ id });
	return issue;
}
async function get(_,{ id }){
	const db = getDb();
	const issue = await db.collection('resissues').findOne({ id });
	return issue;
}

async function patlist(_, { helpreq, effortMin, effortMax }) {
  const db = getDb();
  const filter = {};

  if (helpreq) filter.helpreq = helpreq;

  if (effortMin !== undefined || effortMax !== undefined) {
    filter.quantity = {};
    if (effortMin !== undefined) filter.quantity.$gte = effortMin;
    if (effortMax !== undefined) filter.quantity.$lte = effortMax;
  }

  const issues = await db.collection('patissues').find(filter).toArray();
  return issues;
}

async function patlist(_, { helpreq, effortMin, effortMax }) {
  const db = getDb();
  const filter = {};

  if (helpreq) filter.helpreq = helpreq;

  if (effortMin !== undefined || effortMax !== undefined) {
    filter.quantity = {};
    if (effortMin !== undefined) filter.quantity.$gte = effortMin;
    if (effortMax !== undefined) filter.quantity.$lte = effortMax;
  }

  const issues = await db.collection('patissues').find(filter).toArray();
  return issues;
}

async function list(_, { available, effortMin, effortMax }) {
  const db = getDb();
  const filter = {};

  if (available) filter.available = available;

  if (effortMin !== undefined || effortMax !== undefined) {
    filter.quantity = {};
    if (effortMin !== undefined) filter.quantity.$gte = effortMin;
    if (effortMax !== undefined) filter.quantity.$lte = effortMax;
  }

  const issues = await db.collection('resissues').find(filter).toArray();
  return issues;
}

function validate(issue) {
  const errors = [];
  if (issue.name.length < 3) {
    errors.push('Field "name" must be at least 3 characters long.');
  }

  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function patadd(_, { issue }) {
  const db = getDb();
  validate(issue);

  const newIssue = Object.assign({}, issue);
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('patissues');

  const result = await db.collection('patissues').insertOne(newIssue);
  const savedIssue = await db.collection('patissues')
    .findOne({ _id: result.insertedId });
  return savedIssue;
}

async function add(_, { issue }) {
  const db = getDb();
  validate(issue);

  const newIssue = Object.assign({}, issue);
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('resissues');

  const result = await db.collection('resissues').insertOne(newIssue);
  const savedIssue = await db.collection('resissues')
    .findOne({ _id: result.insertedId });
  return savedIssue;
}
async function patupdate(_, { id, changes }) {
  const db = getDb();
  if (changes.district || changes.helpreq || changes.name) {
    const issue = await db.collection('patissues').findOne({ id });
    Object.assign(issue, changes);
    validate(issue);
  }
  await db.collection('patissues').updateOne({ id }, { $set: changes });
  const savedIssue = await db.collection('patissues').findOne({ id });
  return savedIssue;
}
async function update(_, { id, changes }) {
  const db = getDb();
  if (changes.district || changes.available || changes.name) {
    const issue = await db.collection('resissues').findOne({ id });
    Object.assign(issue, changes);
    validate(issue);
  }
  await db.collection('resissues').updateOne({ id }, { $set: changes });
  const savedIssue = await db.collection('resissues').findOne({ id });
  return savedIssue;
}
async function patremove(_, { id }) {
  const db = getDb();
  const issue = await db.collection('patissues').findOne({ id });
  if (!issue) return false;
  issue.deleted = new Date();

  let result = await db.collection('deleted_issues').insertOne(issue);
  if (result.insertedId) {
    result = await db.collection('patissues').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}
async function remove(_, { id }) {
  const db = getDb();
  const issue = await db.collection('resissues').findOne({ id });
  if (!issue) return false;
  issue.deleted = new Date();

  let result = await db.collection('deleted_issues').insertOne(issue);
  if (result.insertedId) {
    result = await db.collection('resissues').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

module.exports = {
  list,
  patlist,
  add,
  patadd,
  get,
  patget,
  update,
  patupdate,
  patdelete: patremove,
  delete: remove,
};