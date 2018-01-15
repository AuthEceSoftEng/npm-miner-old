import React from 'react';
import styles from './main.module.css';

class SearchResults extends React.Component {
  render() {
    return (
      <div className={styles.searchResults}>
        <ul>
          {this.props.foundPackages.map(pack => (
            <li key={pack.name}>
              <h3>{pack.name}</h3>
              <p>{pack.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SearchResults;
