const npmSearch = require('./data-sources/npm-search');
const NpmPackage = require('./schema-types/npm-package');
const { makeExecutableSchema } = require('graphql-tools');

const Query = `
  type Query {
    npmPackages(name: String!): [NpmPackage]
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
  }
`;

// The resolvers
const resolvers = {
  Query: {
    npmPackages: (_, { name }) => {
      return npmSearch(name);
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Query,
    // we have to destructure array imported from the post.js file
    // as typeDefs only accepts an array of strings or functions
    NpmPackage
  ],
  resolvers
});

// Put together a schema
module.exports = schema;
