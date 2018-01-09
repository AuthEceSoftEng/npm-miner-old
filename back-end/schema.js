const npmSearch = require('./data-sources/npm-search');
const { getCouchDbData } = require('./data-sources/couch-db');

const NpmPackage = require('./schema-types/npm-package');
const MinedPackageInfo = require('./schema-types/mined-package-info');
const FrontPageStats = require('./schema-types/front-page-schema');

const { makeExecutableSchema } = require('graphql-tools');
const GraphQLToolsTypes = require('graphql-tools-types');

const Query = `
  type Query {
    npmPackages(name: String!): [NpmPackage]
    minedPackageInfo(name: String!, a: JSON): MinedPackageInfo
    frontPageStats : FrontPageStats
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
      return getCouchDbData(args.name).then(res => {
        const mPackage = {
          _id: res.data._id,
          name: res.data.name,
          github_repository: res.data.github_repository,
          stars: res.data.stars,
          escomplex: res.data.escomplex
        };
        return mPackage;
      });
    },
    frontPageStats: (parent, args) => {
      return Promise.all([
        getCouchDbData('_design/analytics/_view/tloc'),
        getCouchDbData('_design/analytics/_view/stars?descending=true&limit=10')
      ])
        .then(([loc, topTen]) => {
          return (result = {
            loc: loc.data.rows[0].value,
            numOfPackages: topTen.data.total_rows,
            topTenStars: topTen.data.rows
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Query,
    NpmPackage,
    MinedPackageInfo,
    FrontPageStats
  ],
  resolvers
});

// Put together a schema
module.exports = schema;
