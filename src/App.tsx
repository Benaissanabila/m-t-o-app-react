import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Today from "./components/Today";
import WeekDay from "./components/WeekDay";
import { GeoLocation, WeatherData, WeatherUnits, DailyData, formatWeatherDataDaily } from './utils/utils';

const App: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [geoLoc, setGeoLoc] = useState<GeoLocation>({ latitude: 0, longitude: 0 });
    const [weatherUnits, setWeatherUnits] = useState<WeatherUnits>({});
    const [dailyWeather, setDailyWeather] = useState<DailyData[]>([]);

    const fetchWeather = useCallback(async (url: string) => {
      setError(false);
      try {
        const res = await fetch(url);
        const data: WeatherData = await res.json();
        if (Object.keys(data).length === 0) {
          setError(true);
        } else {
          const formattedDailyData = formatWeatherDataDaily(data.daily);
          setDailyWeather(formattedDailyData);
          setWeatherUnits({
            rain: data.daily_units.precipitation_sum,
            temperature: data.daily_units.temperature_2m_max,
            wind: data.daily_units.wind_speed_10m_max,
          });
        }
      } catch (error) {
        setError(true);
      }
    }, []);

    const getGeolocalisation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setGeoLoc({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }, () => {
        setError(true);
      });
    };

    useEffect(() => {
      setIsLoading(true);
      if (!navigator.geolocation) {
        window.alert("Votre navigateur ne permet pas la géolocalisation pour utiliser cette application !");
        setIsLoading(false);
      } else {
        getGeolocalisation();
      }
    }, []);

    useEffect(() => {
      if (geoLoc.latitude !== 0 && geoLoc.longitude !== 0) {
        fetchWeather(`https://api.open-meteo.com/v1/forecast?latitude=${geoLoc.latitude}&longitude=${geoLoc.longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max&timezone=auto`)
            .finally(() => setIsLoading(false));
      }
    }, [fetchWeather, geoLoc.latitude, geoLoc.longitude]);

    if (isLoading) {
      return (
          <div>
            <p>Chargement...</p>
          </div>
      );
    }

    if (error) {
      return (
          <div>
            <p>Une erreur est survenue lors de la récupération des prévisions météorologiques...</p>
          </div>
      );
    }

    return (
        <div className="">
          <div>
            {dailyWeather.length > 0 && (
                <Today data={dailyWeather[0]} weatherUnits={weatherUnits} />
            )}
            <div>
              {dailyWeather.length > 1 && dailyWeather.slice(1).map((data, index) => (
                  <WeekDay key={index} data={data} weatherUnits={weatherUnits} />
              ))}
            </div>
          </div>
        </div>
    );
  }

  export default App;









