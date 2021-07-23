import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/the-new-css-reset/css/reset.css';
import './common.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
      <header>
        <h1>
          EditorConfig Generator
        </h1>

        <p>
          Please read the <a href="https://editorconfig-specification.readthedocs.io/">EditorConfig Specification</a>
        </p>
      </header>

      <main>
        <App />
      </main>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
