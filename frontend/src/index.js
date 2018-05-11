import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bulma/css/bulma.css';
import '../node_modules/@fortawesome/fontawesome/styles.css'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import initGA from './init'
initGA();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

