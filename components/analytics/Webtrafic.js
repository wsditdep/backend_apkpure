"use client";

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Webtrafic = ({ roles }) => {

    const [lableData, setLabelData] = useState([]);
    const [dataSetInfo, setDataSetInfo] = useState([]);

    const data = {
        labels: lableData,
        datasets: [
            {
                label: 'Role Analytics',
                data: dataSetInfo,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
                text: 'Evaluate user via roles',
            },
        },
    };

    useEffect(() => {

        const selectedProperties = roles.map(item => item.role);
        setLabelData(selectedProperties);

        const dataSetInfo = roles.map(item => item.count);
        setDataSetInfo(dataSetInfo);

    }, []);

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
};

export default Webtrafic;
