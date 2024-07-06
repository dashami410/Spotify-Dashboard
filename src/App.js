import React from 'react';
import SpotifyDataFetcher from './components/SpotifyDataFetcher';
import './index.css'; // Import your styles
import SpotifyDataFetcher2024 from './components/SpotifyDataFetcher2024';

const App = () => {
  return (
    <div className="App">
      <header className="header">
        <div className="logo">Spotify Dashboard</div>
        <nav className="top-nav">
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#reports">Reports</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
        <input type="text" placeholder="Search..." className="search-bar" />
        <div className="profile">
          <img src="https://cdn-icons-png.flaticon.com/128/10438/10438143.png" alt="Profile" />
        </div>
      </header>
      <div className="main-content">
        <main>
        {/* <SpotifyDataFetcher year={2023} />
        <SpotifyDataFetcher year={2024} /> */}

          <SpotifyDataFetcher />
        </main>
      </div>
    </div>
  );
};

export default App;
