import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { useNavigate } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql',
  cache: new InMemoryCache(),
});

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const token = localStorage.getItem('token');
  const apiCall = async () => {
    try {
      const result = await client
      .query({
        context: {
          headers: {
            "authorization": `Bearer ${token}`
          }
        },
        query: gql`
          query GetWeightData {
            getWeightData
          }
        `,
      });
      setData(result?.data?.getWeightData)
    } catch (e) {
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  useEffect(() => {
    apiCall();
  });
  let previous = undefined;
  const chartData = [
    ["Date", "Weight"],
  ].concat( data?.map(({ date, value }, index) => {
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