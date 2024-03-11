import React, { useState, useEffect } from 'react';
import Weather from './components/Weather';

const App = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [newCity, setNewCity] = useState('');
  const [cities, setCities] = useState([
    { name: 'Austin', latitude: 30.26715, longitude: -97.74306 },
    { name: 'Dallas', latitude: 32.78306, longitude: -96.80667 },
    { name: 'Houston', latitude: 29.76328, longitude: -95.36327 },
  ]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  const handleTextSubmit = async () => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(newCity)}&count=1&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error(`Could not find weather for ${newCity}`);
      }

      const result = await response.json();
      const { latitude, longitude } = result.results[0];
      setCities([...cities, { name: newCity, latitude, longitude }]);
      setNewCity('');
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    handleCityClick(cities[0]);
  }, [cities]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Weather App</h1>

      <div>
        {cities.map((city) => (
          <button key={city.name} onClick={() => handleCityClick(city)} style={{ backgroundColor: city === selectedCity ? 'lightBlue' : 'initial' }}>
            {city.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
        <button onClick={handleTextSubmit}>+</button>
      </div>

      {selectedCity && (
        <Weather
          city={selectedCity.name}
          latitude={selectedCity.latitude}
          longitude={selectedCity.longitude}
        />
      )}
    </div>
  );
};

export default App;