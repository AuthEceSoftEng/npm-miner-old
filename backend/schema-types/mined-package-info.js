const GitHubRepo = require('./github-schema');

const MinedPackageInfo = `type MinedPackageInfo {
    _id: String!
    name: String!
    github_repository: String
    stars: Int
    numOfFiles: Int,
    minDirDepth: Int,
    maxDirDepth: Int,
    sumDirDepth: Int,
    eslint: JSON,
    escomplex : JSON,
    nsp: Float,
    gitHubRepo: GitHubRepo
   }`;

module.exports = () => [MinedPackageInfo, GitHubRepo];
