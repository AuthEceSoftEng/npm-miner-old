import React, { Component } from 'react';
import SearchResults from './SearchResults';
import styles from './main.module.css';

import take from 'ramda/src/take';
import { SearchService } from '../../../../../../services/searchService';

class Search extends Component {
  state = {
    foundPackages: [],
    searchBoxFocued: false,
    mouseOverResults: false
  };
  searchService = new SearchService();
  placeholder = 'Search for a package';
  searchResults$ = this.searchService.getResults();

  componentDidMount() {
    this.searchResults$.subscribe(data => {
      this.setFoundPackages(data);
    });
  }

  componentWillUnmount() {
    this.searchResults$.unsubscribe();
  }

  handleChange = event => {
    this.searchService.search({ value: event.target.value.trim() });
  };

  handleFocus = event => {
    this.setState(state => {
      return {
        ...state,
        searchBoxFocued: true
      };
    });
  };

  handleBlur = event => {
    this.setState(state => {
      return {
        ...state,
        searchBoxFocued: false
      };
    });
  };

  shouldResultsRender = ({
    foundPackages,
    searchBoxFocued,
    mouseOverResults
  }) => {
    return foundPackages.length !== 0 && (searchBoxFocued || mouseOverResults);
  };

  handleMouseInResults = mouseOverUL => {
    console.log(mouseOverUL);
    this.setState(state => {
      return {
        ...state,
        mouseOverResults: mouseOverUL
      };
    });
  };

  setFoundPackages = data => {
    this.setState(state => {
      return {
        ...state,
        foundPackages: take(5, data)
      };
    });
  };

  render() {
    return (
      <div className={styles.search}>
        <div>
          <input
            type="text"
            placeholder={this.placeholder}
            onChange={e => this.handleChange(e)}
            onFocus={e => this.handleFocus(e)}
            onBlur={e => this.handleBlur(e)}
          />
          {this.shouldResultsRender(this.state) ? (
            <SearchResults
              foundPackages={this.state.foundPackages}
              checkMouseInResults={this.handleMouseInResults}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

export default Search;
