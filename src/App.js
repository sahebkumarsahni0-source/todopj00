import React, { useEffect, useRef, useState } from "react";

function App() {
  const [city, setCity] = useState("Delhi");
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const searchInputRef = useRef(null);

  
  const API_KEY = "178a95b33b230fb732b5c95e894478d3";

  const getWeather = async (cityName) => {
    if (!cityName || !cityName.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      
      const weatherUrl =
        "https://api.openweathermap.org/data/2.5/weather" +
        "?q=" +
        encodeURIComponent(cityName) +
        "&appid=" +
        API_KEY +
        "&units=metric";

      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          throw new Error(
            "Invalid API key. Please check your OpenWeather API key."
          );
        }

        if (weatherResponse.status === 404) {
          throw new Error(
            "City not found. Please enter a valid city name."
          );
        }

        throw new Error("Weather data could not be loaded.");
      }

      const weatherData = await weatherResponse.json();

      
      const forecastUrl =
        "https://api.openweathermap.org/data/2.5/forecast" +
        "?q=" +
        encodeURIComponent(cityName) +
        "&appid=" +
        API_KEY +
        "&units=metric";

      const forecastResponse = await fetch(forecastUrl);

      if (!forecastResponse.ok) {
        throw new Error("Forecast data could not be loaded.");
      }

      const forecastData = await forecastResponse.json();

      setWeather(weatherData);

    
      const daily = [];

      forecastData.list.forEach((item) => {
        const dateObject = new Date(item.dt * 1000);

        const date = dateObject.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

        const alreadyExists = daily.some(
          (day) => day.date === date
        );

        if (!alreadyExists) {
          daily.push({
            date: date,
            temp: Math.round(item.main.temp),
            humidity: item.main.humidity,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          });
        }
      });

      setForecast(daily.slice(0, 5));
    } catch (err) {
      setWeather(null);
      setForecast([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather(city);

    
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [city]);

  const handleSearch = (event) => {
    event.preventDefault();

    const newCity = search.trim();

    if (!newCity) {
      setError("Please enter a city name.");
      return;
    }

    setCity(newCity);
    setSearch("");
  };

  return (
    <div className="min-vh-100 bg-primary-subtle py-4">

      <div className="container">

        {/* Header */}
        <div className="text-center mb-4">

          <h1 className="fw-bold text-primary">
            🌤️ Live Weather App
          </h1>

          <p className="text-muted">
            Search any city and check live weather
          </p>

        </div>


        {/* Search */}
        <div className="row justify-content-center mb-4">

          <div className="col-12 col-md-8 col-lg-6">

            <form onSubmit={handleSearch}>

              <div className="input-group input-group-lg shadow-sm">

                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search city..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Search"}
                </button>

              </div>

            </form>

          </div>

        </div>


        {/* Error */}
        {error && (
          <div className="row justify-content-center mb-4">

            <div className="col-12 col-md-8 col-lg-6">

              <div className="alert alert-danger text-center shadow-sm">
                ⚠️ {error}
              </div>

            </div>

          </div>
        )}


        {/* Loading */}
        {loading && (
          <div className="text-center my-5">

            <div
              className="spinner-border text-primary"
              role="status"
              style={{
                width: "4rem",
                height: "4rem",
              }}
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="mt-3 fw-bold text-primary">
              Fetching weather...
            </p>

          </div>
        )}


        {/* Current Weather */}
        {!loading && weather && (
          <>

            <div className="row justify-content-center mb-5">

              <div className="col-12 col-md-8 col-lg-6">

                <div className="card border-0 shadow-lg rounded-4">

                  <div className="card-body text-center p-4">

                    {/* City */}
                    <div className="d-flex justify-content-between align-items-center">

                      <div className="text-start">

                        <h2 className="fw-bold mb-0">
                          {weather.name}
                        </h2>

                        <small className="text-muted">
                          {weather.sys.country}
                        </small>

                      </div>

                      <span className="badge bg-success rounded-pill px-3 py-2">
                        ● Live
                      </span>

                    </div>


                    {}
                    <img
                      src={
                        "https://openweathermap.org/img/wn/" +
                        weather.weather[0].icon +
                        "@4x.png"
                      }
                      alt={weather.weather[0].description}
                      width="150"
                      height="150"
                    />


                    {}
                    <h1 className="display-1 fw-bold text-primary mb-0">
                      {Math.round(weather.main.temp)}°C
                    </h1>


                    {}
                    <h4 className="text-capitalize text-secondary mt-2">
                      {weather.weather[0].description}
                    </h4>


                    {/* Details */}
                    <div className="row g-3 mt-3">

                      <div className="col-6">

                        <div className="bg-light rounded-4 p-3">

                          <div className="fs-2">
                            💧
                          </div>

                          <small className="text-muted">
                            Humidity
                          </small>

                          <h5 className="fw-bold mb-0">
                            {weather.main.humidity}%
                          </h5>

                        </div>

                      </div>


                      <div className="col-6">

                        <div className="bg-light rounded-4 p-3">

                          <div className="fs-2">
                            🌡️
                          </div>

                          <small className="text-muted">
                            Feels Like
                          </small>

                          <h5 className="fw-bold mb-0">
                            {Math.round(
                              weather.main.feels_like
                            )}
                            °C
                          </h5>

                        </div>

                      </div>


                      <div className="col-6">

                        <div className="bg-light rounded-4 p-3">

                          <div className="fs-2">
                            💨
                          </div>

                          <small className="text-muted">
                            Wind
                          </small>

                          <h5 className="fw-bold mb-0">
                            {weather.wind.speed} m/s
                          </h5>

                        </div>

                      </div>


                      <div className="col-6">

                        <div className="bg-light rounded-4 p-3">

                          <div className="fs-2">
                            📊
                          </div>

                          <small className="text-muted">
                            Pressure
                          </small>

                          <h5 className="fw-bold mb-0">
                            {weather.main.pressure} hPa
                          </h5>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {}
            <div className="text-center mb-4">

              <h2 className="fw-bold">
                📅 5-Day Forecast
              </h2>

              <p className="text-muted">
                Forecast for {weather.name}
              </p>

            </div>


            {}
            <div className="row g-3">

              {forecast.map((day, index) => (

                <div
                  className="col-12 col-sm-6 col-lg"
                  key={index}
                >

                  <div className="card h-100 border-0 shadow-sm rounded-4">

                    <div className="card-body text-center p-4">

                      <h6 className="fw-bold">
                        {day.date}
                      </h6>

                      <img
                        src={
                          "https://openweathermap.org/img/wn/" +
                          day.icon +
                          "@2x.png"
                        }
                        alt={day.description}
                        width="90"
                        height="90"
                      />

                      <h3 className="fw-bold text-primary">
                        {day.temp}°C
                      </h3>

                      <p className="text-capitalize text-muted">
                        {day.description}
                      </p>

                      <hr />

                      <small>
                        💧 Humidity: {day.humidity}%
                      </small>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>
        )}


        {/* Footer */}
        <div className="text-center mt-5">

          <p className="text-muted">
           whether app made by guvii      
           usse bootstrap css  technologies
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;