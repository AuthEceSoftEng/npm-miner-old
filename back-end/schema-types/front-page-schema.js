const FrontPageStats = `type FrontPageStats {
    loc: Int
    numOfPackages: Int
    topTenStars: JSON
   }`;

module.exports = () => [FrontPageStats];
