import { useEffect, useState } from "react";
import "../scss/index.scss"

export default function Frontpage() {

    const [weather, setWeather] = useState(null)
    const [cityName, setCityName] = useState("London")
    const [searchInput, setSearchInput] = useState("")
    const [coordinations, setCondinations] = useState("")
    const APIKEY = import.meta.env.VITE_WEATHERAPP_APIKEY;

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
            <main>
                <div>
                    <h1>Check Your Weather</h1>
                    <form onSubmit={handleSumbit}>
                        <input 
                        type="text"
                        value={searchInput}
                        onChange={event => setSearchInput(event.target.value)}
                        placeholder="Enter Your city"/>
                    <button type="sumbit"> Check Weather</button>
                    </form>
                </div>

                {weather && weather.main && coordinations && (
                    <>
                    <h2>{coordinations.name}</h2>
                    
                    <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                        alt={weather.weather[0].description} 
                    />
                    <p>{weather.main.temp.toFixed()} &#176;C </p>
                    <p></p>
                    </>
                )}
            </main>
        </>
    )
}