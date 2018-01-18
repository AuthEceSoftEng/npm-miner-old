const GitHubRepo = require('./github-schema');

const MinedPackageInfo = `type MinedPackageInfo {
    _id: String!
    name: String!
    github_repository: String
    stars: Int
    escomplex : JSON
    gitHubRepo: GitHubRepo
   }`;

module.exports = () => [MinedPackageInfo, GitHubRepo];
