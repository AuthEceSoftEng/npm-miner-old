import React from 'react';
import ReactDOM from 'react-dom';
// import './global.css';
import App from './scenes/App/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
