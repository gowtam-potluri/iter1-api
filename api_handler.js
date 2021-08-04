const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const issue = require('./issue.js');

const resolvers = {
  Query: {
    about: about.getMessage,
    resList: issue.list,
    patList: issue.patlist,
	  issue:issue.get,
    patissue: issue.patget,

  },
 
  Mutation: {
    setAboutMessage: about.setMessage,
    resissueAdd: issue.add,
    resissueUpdate: issue.update,
    resissueDelete: issue.delete,
    patissueAdd: issue.patadd,
    patissueUpdate: issue.patupdate,
    patissueDelete: issue.patdelete,
  },
  GraphQLDate,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
  playground: true,
  introspection: true,
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler };