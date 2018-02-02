import React from 'react';

const PackageDetails = ({ match }) => {
  return <h1>{match.params.packagename}</h1>;
};

export default PackageDetails;
