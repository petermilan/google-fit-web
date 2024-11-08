import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client";
import { useRef } from 'react';
import { Chart } from "react-google-charts";
import { useNavigate } from 'react-router-dom';

const GET_WEIGHT_DATA = gql`
  query GetWeightData($payload: WeightPayload) {
    getWeightData(payload: $payload)
  }
`;

const addMisingValues = (data) => {
  let previous = undefined;
  return data.map(({ date, value }, index) => {
    const weight = value ?? previous;
    const itmes = [date, weight];
    previous = weight;
    return itmes;
  })
};

const buildChartData = (data) => {
  const completeData = addMisingValues(data).map((item) => {
    item[0] = new Date(Date.parse(item[0]));
    return item;
  });
  return [
    ["Date", "Weight"],
  ].concat(completeData);
}

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const now = new Date();
  if (!token) {
    navigate('/');
  }

  const { data: dailyData, error: dailyError, isLoading: dailyIsLoading } = useQuery(GET_WEIGHT_DATA, {
    variables: {
      payload: {
        value: 1,
        type: 'day',
        startTimeMillis: useRef(new Date(now.getFullYear(), now.getMonth() -1, 1)).current,
        endTimeMillis: useRef(now).current,
      }
    }
  });

  const { data: monthlyData, error: monthlyError, isLoading: monthlyIsLoading } = useQuery(GET_WEIGHT_DATA, {
    variables: {
      payload: {
        value: 1,
        type: 'month',
        startTimeMillis: useRef(new Date(now.getFullYear() -1, now.getMonth(), 1)).current,
        endTimeMillis: useRef(now).current,
      }
    }
  });

  const { data: yearlyData, error: yearlyError, isLoading: yearlyIsLoading } = useQuery(GET_WEIGHT_DATA, {
    variables: {
      payload: {
        value: 12,
        type: 'month',
        startTimeMillis: useRef(new Date(now.getFullYear() -5, now.getMonth(), 1)).current,
        endTimeMillis: useRef(now).current,
      }
    }
  });


  if (dailyIsLoading || monthlyIsLoading || yearlyIsLoading) {
    return <p> Loading...</p>;
  }

  if (dailyError || monthlyError || yearlyError) {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (!dailyData || !monthlyData || !yearlyData) {
    return <p> Loading...</p>
  }

  const options = {
    title: "Weight",
    hAxis: {
      title: "Date",

    },
    vAxis: { title: "Weight (kg)" },

    curveType: "function",
  };

  return (
    <div>
      <p>Last Month Daily Data</p>
      <Chart
        chartType="LineChart"
        width="100%"
        height="250px"
        data={buildChartData(dailyData?.getWeightData)}
        options={options}
      />
      <p>Last Year Monthly Data</p>
      <Chart
        chartType="LineChart"
        width="100%"
        height="250px"
        data={buildChartData(monthlyData?.getWeightData)}
        options={options}
      />
      <p>Last 5 Years Data</p>
      <Chart
        chartType="LineChart"
        width="100%"
        height="250px"
        data={buildChartData(yearlyData?.getWeightData)}
        options={options}
      />
    </div>
  )
};

export default Home;