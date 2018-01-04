const npmSearch = require('./data-sources/npm-search');
const {
  getMinedPackage,
  createGraphqlResponse
} = require('./data-sources/couch-db');
const NpmPackage = require('./schema-types/npm-package');
const MinedPackageInfo = require('./schema-types/mined-package-info');
const { makeExecutableSchema } = require('graphql-tools');
const GraphQLToolsTypes = require('graphql-tools-types');

const Query = `
  type Query {
    npmPackages(name: String!): [NpmPackage]
    minedPackageInfo(name: String!, a: JSON): MinedPackageInfo
    exampleJSON(json: JSON): JSON
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
  }
  scalar JSON
`;

// The resolvers
const resolvers = {
  JSON: GraphQLToolsTypes.JSON({ name: 'MyJSON' }),
  Query: {
    npmPackages: (_, { name }) => {
      return npmSearch(name);
    },
    minedPackageInfo: (_, args) => {
      return getMinedPackage(args.name).then(res => {
        const mPackage = {
          _id: res.data._id,
          name: res.data.name,
          github_repository: res.data.github_repository,
          stars: res.data.stars,
          escomplex: res.data.escomplex
        };
        console.log(mPackage);
        return mPackage;
      });
    },
    exampleJSON: (root, args, ctx, info) => {
      console.log(args.json);
      return args.json;
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, Query, NpmPackage, MinedPackageInfo],
  resolvers
});

// Put together a schema
module.exports = schema;
