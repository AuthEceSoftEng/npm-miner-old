const MinedPackageInfo = `type MinedPackageInfo {
    _id: String!
    name: String!
    github_repository: String
    stars: Int
   }`;

module.exports = () => [MinedPackageInfo];
