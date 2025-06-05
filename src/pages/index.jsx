import { useEffect, useState } from "react";
import "../scss/index.scss"

export default function Frontpage() {

    const [forecast, setForecast] = useState(null)
    const [weather, setWeather] = useState(null)
    const [cityName, setCityName] = useState("London")
    const [searchInput, setSearchInput] = useState("")
    const [coordinations, setCondinations] = useState("")
    const APIKEY = import.meta.env.VITE_WEATHERAPP_APIKEY;

    useEffect(() => {
        if (!coordinations) return;

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinations.lat}&lon=${coordinations.lon}&units=metric&appid=${APIKEY}`;
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                setForecast(data);
                console.log('Forecast data:', data);
            });
    }, [coordinations, APIKEY]);

    useEffect(() => {
        const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKEY}`
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    setCondinations({ lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country, state: data[0].state, local_names: data[0].local_names, dt: data[0].dt });
                    console.log(data)
                } else {
                    setCondinations(null);
                    setWeather(null);
                }
            })
    }, [cityName, APIKEY]);

    useEffect(() => {
        if (!coordinations) return;

        const fetchCoordinations = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinations.lat}&lon=${coordinations.lon}&units=metric&appid=${APIKEY}`;
        fetch(fetchCoordinations)
            .then(response => response.json())
            .then(data => {
                setWeather(data);
                console.log(data)
            });

    }, [coordinations, APIKEY]);

    const handleSumbit = (event) => {
        event.preventDefault();
        if (searchInput.trim()) setCityName(searchInput.trim());
    }
    return (
        <>
            <main className="Weatherapp">
                <div className="Weatherapp__searchflex">
                    <form onSubmit={handleSumbit}>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={event => setSearchInput(event.target.value)}
                            placeholder="Enter Your city" />
                        <button type="sumbit"> Check Weather</button>
                    </form>
                </div>
                <h1>Check Your Weather</h1>

                {weather && weather.main && coordinations && (
                    <>
                        <h2>{coordinations.name}</h2>

                        <p className="Weatherapp__forecast-description">{weather.weather[0].description}</p>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                        />
                        <p>{weather.main.temp.toFixed()} &#176;C </p>
                        <p>Wind: {(weather.wind.speed || 0).toFixed(1)} m/s</p>
                        <p>Rain: {((weather.rain?.['1h'] || weather.rain?.['3h']) || 0)} mm</p>
                    </>
                )}

   {forecast && (
    <div className="Weatherapp__forecast">
        {forecast.list
            // Filter to get one forecast per day
            .filter((item, index) => {
                const date = new Date(item.dt * 1000).getDate();
                return (
                    index === forecast.list.findIndex(item2 => 
                        new Date(item2.dt * 1000).getDate() === date
                    )
                );
            })
            // Take first 7 days
            .slice(0, 7)
            .map((day, index) => (
                <div key={index} className="Weatherapp__forecast-day">
                    <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    })}</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt={day.weather[0].description}
                    />
                    <p>{day.main.temp.toFixed()} &#176;C</p>
                    <p className="Weatherapp__forecast-description">{day.weather[0].description}</p>
                    <p>Wind: {(day.wind.speed || 0).toFixed(1)} m/s</p>
    <p>Rain chance: {((day.pop || 0) * 100).toFixed()}%</p>
                </div>
            ))
        }
    </div>
)}
            </main>
        </>
    )
}