import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useSearchParams, useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql',
  cache: new InMemoryCache(),
});


const GetToken = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');

  const apiCall = async () => {
    const result = await client
    .query({
      query: gql`
        query GetAuthCodeToken($payload: Payload) {
          getAuthCodeToken(payload: $payload) {
            token
          }
        }
      `,
      variables: {
        payload: { code },
      }
    });

    localStorage.setItem('token', result?.data?.getAuthCodeToken?.token)
    navigate('/weight');
  }

  useEffect(() => {
    apiCall();
  });

  return <h1>Code {code}</h1>;
};

export default GetToken;