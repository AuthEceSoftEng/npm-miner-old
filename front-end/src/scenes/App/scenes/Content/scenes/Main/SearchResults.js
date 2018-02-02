import React from 'react';
import { Link } from 'react-router-dom';
import styles from './main.module.css';

class SearchResults extends React.Component {
  handleMouseEnter = e => {
    this.props.checkMouseInResults(true);
  };

  handleMouseLeave = e => {
    this.props.checkMouseInResults(false);
  };

  handleMouseOver = e => {
    this.props.checkMouseInResults('over');
    e.stopPropagation();
  };

  handleMouseOut = e => {
    this.props.checkMouseInResults('out');
    e.stopPropagation();
  };

  handleMouseOverCapture = e => {
    this.props.checkMouseInResults('over capture');
    e.stopPropagation();
  };

  handleMouseOutCapture = e => {
    this.props.checkMouseInResults('out capture');
    e.stopPropagation();
  };

  render() {
    return (
      <div
        className={styles.searchResults}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <ul>
          {this.props.foundPackages.map(pack => (
            <li tabIndex="0" key={pack.name}>
              <Link className={styles.plainText} to={`/package/${pack.name}`}>
                <h3>{pack.name}</h3>
                <p>{pack.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SearchResults;
