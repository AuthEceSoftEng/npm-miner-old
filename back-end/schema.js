const npmSearch = require('./data-sources/npm-search');
const {
  getMinedPackage,
  createGraphqlResponse
} = require('./data-sources/couch-db');
const NpmPackage = require('./schema-types/npm-package');
const MinedPackageInfo = require('./schema-types/mined-package-info');
const { makeExecutableSchema } = require('graphql-tools');

const Query = `
  type Query {
    npmPackages(name: String!): [NpmPackage]
    minedPackageInfo(name: String!): MinedPackageInfo
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
    },
    minedPackageInfo: (_, { name }) => {
      return createGraphqlResponse(getMinedPackage(name));
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, Query, NpmPackage, MinedPackageInfo],
  resolvers
});

// Put together a schema
module.exports = schema;
