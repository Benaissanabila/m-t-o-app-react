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
          <div className={"min-h-screen h-max bg-cyan-600 flex justify-center items-start p-8 md:px-20"}>
            <p className={"text-center "}>Chargement...</p>
          </div>
      );
    }

    if (error) {
      return (
          <div>
            <p className={"text-center text-red-500 "}>Une erreur est survenue lors de la récupération des prévisions météorologiques...</p>
          </div>
      );
    }

    return (
        <div >
          <div className={"min-h-screen h-max bg-cyan-600 flex  justify-center items-start p-8 md:px-20"}>
              <div className={"w-full-max-w-7xl bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg p-4 md:px-12 md:py-8 xl:py-12 xl:px:-28"}>{dailyWeather.length > 0 && (
                  < Today data={dailyWeather[0]} weatherUnits={weatherUnits} />
            )}
            <div className={"grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-6 "}>
              {dailyWeather.length > 1 && dailyWeather.slice(1).map((data, index) => (
                  <WeekDay key={index} data={data} weatherUnits={weatherUnits} />
              ))}
            </div>
          </div></div>
        </div>
    );
  }

  export default App;









