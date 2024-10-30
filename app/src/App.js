import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css';
import Layout from './pages/Layout';
import Home from './pages/Home';
import GetToken from './pages/GetToken';
import Weight from './pages/Weight';
import NoPage from './pages/NoPage';

function App() {

  const httpLink = new HttpLink({ uri: 'http://localhost:8000/graphql' });

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }));

    return forward(operation);
  })

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink.from([authMiddleware, httpLink]),
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/get-token" element={<GetToken />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ApolloProvider>
  );
}

export default App;
