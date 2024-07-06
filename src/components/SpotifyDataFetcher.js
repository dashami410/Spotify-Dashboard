import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import getToken from './getToken';
import '../index.css';

const SpotifyDataFetcher2024 = () => {
  const [data2023, setData2023] = useState([]);
  const [data2024, setData2024] = useState([]);
  const [error, setError] = useState(null);
  const barChartRef2023 = useRef(null);
  const lineChartRef2023 = useRef(null);
  const pieChartRef2023 = useRef(null);
  const barChartRef2024 = useRef(null);
  const lineChartRef2024 = useRef(null);
  const pieChartRef2024 = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        console.log('Access Token:', token);

        // Fetch data for 2023
        const response2023 = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            q: 'year:2023', // Fetching albums released in 2023
            type: 'album',
            market: 'IN',
            limit: 50
          }
        });

        console.log('API Response 2023:', response2023.data);

        if (response2023.data.albums && response2023.data.albums.items) {
          const releases2023 = response2023.data.albums.items.filter(album => {
            const releaseYear = new Date(album.release_date).getFullYear();
            return releaseYear === 2023;
          });

          console.log('Releases in 2023:', releases2023);

          setData2023(releases2023);
        } else {
          console.error('Error: Invalid data structure in API response (2023)');
          setError(new Error('Invalid data structure in API response (2023)'));
        }

        // Fetch data for 2024
        const response2024 = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            q: 'year:2024', // Fetching albums released in 2024
            type: 'album',
            market: 'IN',
            limit: 50
          }
        });

        console.log('API Response 2024:', response2024.data);

        if (response2024.data.albums && response2024.data.albums.items) {
          const releases2024 = response2024.data.albums.items.filter(album => {
            const releaseYear = new Date(album.release_date).getFullYear();
            return releaseYear === 2024;
          });

          console.log('Releases in 2024:', releases2024);

          setData2024(releases2024);
        } else {
          console.error('Error: Invalid data structure in API response (2024)');
          setError(new Error('Invalid data structure in API response (2024)'));
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
      if (data2023.length === 0 && data2024.length === 0) {
        return;
      }

      // Data processing for 2023
      if (data2023.length > 0) {
        const releasesByMonth2023 = {};
        data2023.forEach(album => {
          const releaseMonth = new Date(album.release_date).getMonth();
          if (releasesByMonth2023[releaseMonth]) {
            releasesByMonth2023[releaseMonth]++;
          } else {
            releasesByMonth2023[releaseMonth] = 1;
          }
        });

        const months2023 = Object.keys(releasesByMonth2023).map(month => parseInt(month, 10) + 1);
        const releaseCounts2023 = Object.values(releasesByMonth2023);

        console.log('Months 2023:', months2023);
        console.log('Release Counts 2023:', releaseCounts2023);

        // Destroy existing chart instances if they exist
        if (barChartRef2023.current) {
          barChartRef2023.current.destroy();
        }
        if (lineChartRef2023.current) {
          lineChartRef2023.current.destroy();
        }
        if (pieChartRef2023.current) {
          pieChartRef2023.current.destroy();
        }

        // Bar Chart for 2023
        const barCtx2023 = document.getElementById('barChart2023');
        barChartRef2023.current = new Chart(barCtx2023, {
          type: 'bar',
          data: {
            labels: months2023.map(month => `2023 - ${month}`),
            datasets: [{
              label: 'Number of Releases',
              data: releaseCounts2023,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
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

        // Line Chart for 2023
        const lineCtx2023 = document.getElementById('lineChart2023');
        lineChartRef2023.current = new Chart(lineCtx2023, {
          type: 'line',
          data: {
            labels: months2023.map(month => `2023 - ${month}`),
            datasets: [{
              label: 'Number of Releases',
              data: releaseCounts2023,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
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

        // Pie Chart for 2023
        const pieCtx2023 = document.getElementById('pieChart2023');
        pieChartRef2023.current = new Chart(pieCtx2023, {
          type: 'pie',
          data: {
            labels: months2023.map(month => `2023 - ${month}`),
            datasets: [{
              label: 'Number of Releases',
              data: releaseCounts2023,
              backgroundColor: months2023.map(() => `rgba(255, 99, 132, 0.2)`),
              borderColor: months2023.map(() => `rgba(255, 99, 132, 1)`),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
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
      }

      // Data processing for 2024
      if (data2024.length > 0) {
        const releasesByMonth2024 = {};
        data2024.forEach(album => {
          const releaseMonth = new Date(album.release_date).getMonth();
          if (releasesByMonth2024[releaseMonth]) {
            releasesByMonth2024[releaseMonth]++;
          } else {
            releasesByMonth2024[releaseMonth] = 1;
          }
        });

        const months2024 = Object.keys(releasesByMonth2024).map(month => parseInt(month, 10) + 1);
        const releaseCounts2024 = Object.values(releasesByMonth2024);

        console.log('Months 2024:', months2024);
        console.log('Release Counts 2024:', releaseCounts2024);

        // Destroy existing chart instances if they exist
        if (barChartRef2024.current) {
          barChartRef2024.current.destroy();
        }
        if (lineChartRef2024.current) {
          lineChartRef2024.current.destroy();
        }
        if (pieChartRef2024.current) {
          pieChartRef2024.current.destroy();
        }

        // Bar Chart for 2024
        const barCtx2024 = document.getElementById('barChart2024');
        barChartRef2024.current = new Chart(barCtx2024, {
          type: 'bar',
          data: {
            labels: months2024.map(month => `2024 - ${month}`),
            datasets: [{
              label: 'Number of Releases',
              data: releaseCounts2024,
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
                display: true,
                position: 'top'
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

        // Line Chart for 2024
        const lineCtx2024 = document.getElementById('lineChart2024');
        lineChartRef2024.current = new Chart(lineCtx2024, {
          type: 'line',
          data: {
            labels: months2024.map(month => `2024 - ${month}`),
            datasets: [{
              label: 'Number of Releases',
              data: releaseCounts2024,
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
                display: true,
                position: 'top'
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

        // Pie Chart for 2024
        const pieCtx2024 = document.getElementById('pieChart2024');
        pieChartRef2024.current = new Chart(pieCtx2024, {
          type: 'pie',
          data: {
            labels: months2024.map(month => `2024 - ${month}`),
            datasets: [{
              label: 'Number of Releases',
              data: releaseCounts2024,
              backgroundColor: months2024.map(() => `rgba(54, 162, 235, 0.2)`),
              borderColor: months2024.map(() => `rgba(54, 162, 235, 1)`),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
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
      }
    };

    // Create charts when data changes
    if (data2023.length > 0 || data2024.length > 0) {
      createCharts();
    }

    return () => {
      // Clean up charts on unmount or before re-render
      if (barChartRef2023.current) {
        barChartRef2023.current.destroy();
      }
      if (lineChartRef2023.current) {
        lineChartRef2023.current.destroy();
      }
      if (pieChartRef2023.current) {
        pieChartRef2023.current.destroy();
      }
      if (barChartRef2024.current) {
        barChartRef2024.current.destroy();
      }
      if (lineChartRef2024.current) {
        lineChartRef2024.current.destroy();
      }
      if (pieChartRef2024.current) {
        pieChartRef2024.current.destroy();
      }
    };
  }, [data2023, data2024]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {(data2023.length > 0 || data2024.length > 0) ? (
        <div>
          <h2>New Releases in 2023</h2>
          <div id="chartContainer2023" className="chart-container">
            <div className="chart-card">
              <canvas id="barChart2023"></canvas>
            </div>
            <div className="chart-card">
              <canvas id="lineChart2023"></canvas>
            </div>
            <div className="chart-card">
              <canvas id="pieChart2023"></canvas>
            </div>
          </div>
          
          <h2>New Releases in 2024</h2>
          <div id="chartContainer2024" className="chart-container">
            <div className="chart-card" id="left">
              <canvas id="barChart2024"></canvas>
            </div>
            <div className="chart-card" id="middle">
              <canvas id="lineChart2024"></canvas>
            </div>
            <div className="chart-card" id='right'>
              <canvas id="pieChart2024"></canvas>
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
