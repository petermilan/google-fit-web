import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';;


const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/weight');
  }

  const {data, isLoading} = useQuery(gql`
    query GetAuthUrl {
      getAuthUrl {
        url
      }
    }
  `);

  return (
    <div>
      <a
        disabled={!isLoading}
        className="App-link"
        href={data?.getAuthUrl?.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Auth Google Fit
      </a>
    </div>
  )
};

export default Home;