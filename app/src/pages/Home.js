import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql',
  cache: new InMemoryCache(),
});

const Home = () => {
  const navigate = useNavigate();
  const [authUrl, setAuthUrl] = useState();
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/weight');
  }

  const apiCall = async () => {
    const result = await client
    .query({
      query: gql`
        query GetAuthUrl {
          getAuthUrl {
            url
          }
        }
      `,
    });
    return setAuthUrl(result?.data?.getAuthUrl?.url);
  }

  useEffect(() => {
    apiCall();
  }, []);

  return (
    <div>
      <a
        className="App-link"
        href={authUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Auth Google Fit
      </a>
    </div>
  )
};

export default Home;