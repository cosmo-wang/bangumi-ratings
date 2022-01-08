import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const serverUrl = process.env.NODE_ENV === 'production' ? 'https://bangumi-ratings-server.com/graphql' : 'http://localhost:8080/graphql';
// const serverUrl = 'https://bangumi-ratings-server.com/graphql';
const client = new ApolloClient({
  uri: serverUrl,
  cache: new InMemoryCache()
});

const theam = createTheme({
  palette: {
    primary: {
      main: '#fe8a96'
    }
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theam}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
