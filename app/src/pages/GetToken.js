import { gql, useQuery } from '@apollo/client';
import { useSearchParams, useNavigate } from "react-router-dom";

const GetToken = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');

  const {data, isLoading} = useQuery(gql`
    query GetAuthCodeToken($payload: Payload) {
      getAuthCodeToken(payload: $payload) {
        token
      }
    }`,
    {
      variables: {
        payload: { code },
      }
    }
  );

    if (!isLoading) {
      localStorage.setItem('token', data?.getAuthCodeToken?.token)
      navigate('/weight');
    }

  return <h1>Code {code}</h1>;
};

export default GetToken;