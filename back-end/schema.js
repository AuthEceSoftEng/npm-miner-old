const npmSearch = require('./data-sources/npm-search');
const {
  getCouchDbData,
  getNpmIOData,
  gitHubData,
  gitHubRepoToOwnerAndPackage
} = require('./data-sources/http-sources');

const NpmPackage = require('./schema-types/npm-package');
const MinedPackageInfo = require('./schema-types/mined-package-info');
const NpmIOPackage = require('./schema-types/npmio-package');
const GitHubRepo = require('./schema-types/github-schema');
const FrontPageStats = require('./schema-types/front-page-schema');

const {
  addResolveFunctionsToSchema,
  makeExecutableSchema
} = require('graphql-tools');
const GraphQLToolsTypes = require('graphql-tools-types');

const Query = `
  type Query {
    npmPackages(name: String!): [NpmPackage]
    minedPackageInfo(name: String!): MinedPackageInfo
    frontPageStats : FrontPageStats
    npmsIoPackage(name: String!): NpmIOPackage
    gitHubRepo(owner: String, repo: String):  GitHubRepo
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
    npmsIoPackage: (parent, { name }) => {
      return (data = getNpmIOData(name));
    },
    npmPackages: (_, { name }) => {
      return npmSearch(name).then(data => {
        return data;
      });
    },
    minedPackageInfo: (_, args) => {
      return getCouchDbData(args.name).then(res => {
        return res.data;
      });
    },
    frontPageStats: (parent, args) => {
      return Promise.all([
        getCouchDbData('_design/results/_view/tloc'),
        getCouchDbData(
          '_design/filters/_view/filteredStars?descending=true&limit=10'
        )
      ])
        .then(([loc, topTen]) => {
          return (result = {
            loc: loc.data.rows[0].value.sum,
            numOfPackages: topTen.data.total_rows,
            topTenStars: topTen.data.rows
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  MinedPackageInfo: {
    gitHubRepo(minedPackage) {
      return gitHubData(
        gitHubRepoToOwnerAndPackage(minedPackage.github_repository)
      ).then(res => {
        return { data: res.data };
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
    NpmIOPackage,
    FrontPageStats
  ]
});
addResolveFunctionsToSchema(schema, resolvers);

// Put together a schema
module.exports = schema;
