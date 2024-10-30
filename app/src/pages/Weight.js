import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client";
import { Chart } from "react-google-charts";
import { useNavigate } from 'react-router-dom';

const GET_WEIGHT_DATA = gql`
  query GetWeightData {
    getWeightData
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/');
  }

  const {data, isError, isLoading} = useQuery(GET_WEIGHT_DATA)

  if (isLoading) {
    return <p> DATA IS LOADING...</p>;
  }

  if (isError) {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (!data) {
    return <p>No data</p>
  }

  let previous = undefined;
  const chartData = [
    ["Date", "Weight"],
  ].concat( data?.getWeightData?.map(({ date, value }, index) => {
    const weight = value ?? previous;
    const itmes = [date, weight];
    previous = weight;
    return itmes;
  }));

  const options = {
    title: "Weight",
    hAxis: {
      title: "Date",
      gridlines: { count: 3 },
      format: "m d, yyyy",
    },
    vAxis: { title: "Weight (kg)" },
    legend: "none",
    curveType: "function",

  };

  return (
    <div>
      <h2>
      Daily Weight Data
      </h2>
      Contains daily data from 1st day of previous month until now
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData}
        options={options}
      />
    </div>
  )
};

export default Home;