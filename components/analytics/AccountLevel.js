"use client";

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AccountLevel = ({ membership }) => {

  const [lableData, setLabelData] = useState([]);
  const [dataSetInfo, setDataSetInfo] = useState([]);

  const data = {
    labels: lableData,
    datasets: [
      {
        label: 'Commission(%)',
        data: dataSetInfo,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Membership Level | Commission Value',
      },
    },
  };

  useEffect(() => {

    const selectedProperties = membership.map(item => item.membership_name);
    setLabelData(selectedProperties);

    const dataSetInfo = membership.map(item => (item.commission_rate * 100)?.toFixed(2));
    setDataSetInfo(dataSetInfo);

  }, []);

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AccountLevel;
