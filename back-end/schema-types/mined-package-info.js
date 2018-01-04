const MinedPackageInfo = `type MinedPackageInfo {
    _id: String!
    name: String!
    github_repository: String
    stars: Int
    escomplex : JSON
   }`;

module.exports = () => [MinedPackageInfo];
