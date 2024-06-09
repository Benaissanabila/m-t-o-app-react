import React, {useEffect, useState} from 'react';
import { DailyData, WeatherUnits } from '../utils/utils';
import {getEmojies} from "../utils/getEmojies";
import {formateDateToHourMinutes} from "../utils/formateDateToHourMinutes";

interface WeekDayProps {
    data: DailyData;
    weatherUnits: WeatherUnits;
}

const WeekDay: React.FC<WeekDayProps> = ({ data, weatherUnits }) => {
    const [weatherEmojis, setWeatherEmojis] = useState("")
    const [averageTemperature, setAverageTemperature] = useState<number | undefined>(undefined)
    useEffect(() => {
        if (!data) return;
        const avTemp = parseFloat(((data.temperature_2m_max + data.temperature_2m_min) / 2).toFixed(1));
        const weatherEmojis = getEmojies(avTemp,data.precipitation_sum,data.wind_speed_10m_max);
        setAverageTemperature(avTemp)
        setWeatherEmojis(weatherEmojis)
    }, [data]);
    if (!data || !weatherUnits.temperature) {
        return <div>Erreur...</div>
    }
    const sunriseDate = new Date(data.sunrise); // Convertir la chaîne de caractères en objet Date
    const formattedSunrise = formateDateToHourMinutes(sunriseDate);
    const dataSunset = new Date (data.sunset)
    const formattedSunset = formateDateToHourMinutes(dataSunset);
    return (
        <div>
            <h2> {data.day}</h2>
            <p>Date: {data.time}</p>
            <p>{averageTemperature}<span>{weatherUnits.temperature}</span></p>
            <div>{weatherEmojis && <div>{weatherEmojis}</div>}</div>
            <p>Lever du soleil: {formattedSunrise}</p>
            <p>Coucher du soleil: {formattedSunset}</p>
            <p>Précipitations: {data.precipitation_sum} {weatherUnits.rain}</p>
            <p>Vent max: {data.wind_speed_10m_max} {weatherUnits.wind}</p>
        </div>
    );
};

export default WeekDay;

