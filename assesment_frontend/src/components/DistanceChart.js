import React from 'react';
import { Line } from 'react-chartjs-2';
import { haversineDistance } from '../utils/distance';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DistanceChart = ({ locations }) => {
  const distances = [];
  const labels = [];

  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const distance = haversineDistance(locations[i], locations[j]);
      distances.push(distance);
      labels.push(`From ${locations[i].name} to ${locations[j].name}`);
    }
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Distance (km)',
        data: distances,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default DistanceChart;