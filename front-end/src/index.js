import React from 'react';
import ReactDOM from 'react-dom';
// import './global.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import  'typeface-oxygen'


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
