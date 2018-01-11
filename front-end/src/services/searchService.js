import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { fromPromise } from 'rxjs/add/observable/fromPromise';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
  cache: new InMemoryCache()
});

export class SearchService {
  constructor() {
    this.searchTerm = new Subject();
  }

  search = term => {
    this.searchTerm.next(term.value);
  };

  doSearch(term) {
    let promise = client.query({
      query: gql`
        query searchedPackages($name: String!) {
          npmPackages(name: $name) {
            name
            description
          }
        }
      `,
      variables: {
        name: term
      }
    });

    return Observable.fromPromise(promise).map(res =>
      Observable.of(res.data.npmPackages)
    );
  }

  getResults() {
    return this.searchTerm
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => (term ? this.doSearch(term) : Observable.of([])))
      .map(x => {
        return x.value !== undefined ? x.value : [];
      })
      .catch(error => {
        console.error(error);
        return Observable.of([]);
      });
  }
}
