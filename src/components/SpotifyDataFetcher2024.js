import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import getToken from './getToken';
import '../index.css';

const SpotifyDataFetcher2024 = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        console.log('Access Token:', token);

        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            q: 'year:2024', // Updated to fetch albums released in 2024
            type: 'album',
            market: 'IN',
            limit: 50
          }
        });

        console.log('API Response:', response.data);

        if (response.data.albums && response.data.albums.items) {
          const releases2024 = response.data.albums.items.filter(album => {
            const releaseYear = new Date(album.release_date).getFullYear();
            return releaseYear === 2024;
          });

          console.log('Releases in 2024:', releases2024);

          setData(releases2024);
        } else {
          console.error('Error: Invalid data structure in API response');
          setError(new Error('Invalid data structure in API response'));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const createCharts = () => {
      if (data.length === 0) {
        return;
      }

      // Data processing for charts
      const releasesByMonth = {};
      data.forEach(album => {
        const releaseMonth = new Date(album.release_date).getMonth();
        if (releasesByMonth[releaseMonth]) {
          releasesByMonth[releaseMonth]++;
        } else {
          releasesByMonth[releaseMonth] = 1;
        }
      });

      const months = Object.keys(releasesByMonth).map(month => parseInt(month, 10) + 1);
      const releaseCounts = Object.values(releasesByMonth);

      console.log('Months:', months);
      console.log('Release Counts:', releaseCounts);

      // Destroy existing chart instances if they exist
      if (barChartRef.current !== null) barChartRef.current.destroy();
      if (lineChartRef.current !== null) lineChartRef.current.destroy();
      if (pieChartRef.current !== null) pieChartRef.current.destroy();

      // Bar Chart
      const barCtx = document.getElementById('barChart');
      barChartRef.current = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: months.map(month => `${month}`),
          datasets: [{
            label: 'Number of Releases',
            data: releaseCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `Number of Releases: ${tooltipItem.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Releases'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          }
        }
      });

      // Line Chart
      const lineCtx = document.getElementById('lineChart');
      lineChartRef.current = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: months.map(month => `${month}`),
          datasets: [{
            label: 'Number of Releases',
            data: releaseCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `Number of Releases: ${tooltipItem.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Releases'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          }
        }
      });

      // Pie Chart
      const pieCtx = document.getElementById('pieChart');
      pieChartRef.current = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: months.map(month => `${month}`),
          datasets: [{
            label: 'Number of Releases',
            data: releaseCounts,
            backgroundColor: months.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`),
            borderColor: months.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `Number of Releases: ${tooltipItem.raw}`;
                }
              }
            }
          }
        }
      });
    };

    if (data.length > 0) {
      createCharts();
    }

    return () => {
      if (barChartRef.current !== null) barChartRef.current.destroy();
      if (lineChartRef.current !== null) lineChartRef.current.destroy();
      if (pieChartRef.current !== null) pieChartRef.current.destroy();
    };
  }, [data]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data.length > 0 ? (
        <div>
          <h2>New Releases in 2024</h2>
          <div id="chartContainer">
            <div className="chart-card">
              <canvas id="barChart"></canvas>
            </div>
            <div className="chart-card">
              <canvas id="lineChart"></canvas>
            </div>
            <div className="chart-card">
              <canvas id="pieChart"></canvas>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SpotifyDataFetcher2024;
