import React, { useState, useEffect } from 'react';

const Weather = ({ city, latitude, longitude }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const result = await response.json();
        setData(result);
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchData();
    }
  }, [city, latitude, longitude]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    
    return null;
  }

  return (
    <div>
      <h2>Weather for {city}</h2>
      <ul>
      {data.hourly.time.slice(0, 24).map((time, index) => {
        const formattedTime = new Date(time).toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        return (
          <li key={time}>
            {formattedTime}: {data.hourly.temperature_2m[index]} °F
          </li>
        );
      })}
    </ul>
    </div>
  );
};

export default Weather;