import React, {useEffect, useState} from 'react';
import { DailyData, WeatherUnits } from "../utils/utils";
import {getEmojies} from "../utils/getEmojies";
import {Emojis} from "../utils/emojies";
import {formateDateToHourMinutes} from "../utils/formateDateToHourMinutes";

interface TodayProps {
    data: DailyData | undefined;
    weatherUnits: WeatherUnits;
}

const Today: React.FC<TodayProps> = ({ data, weatherUnits }) => {
    const [weatherEmojis, setWeatherEmojis] = useState("");
    const [averageTemperature, setAverageTemperature] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!data) return;

        const avTemp = parseFloat(((data.temperature_2m_max + data.temperature_2m_min) / 2).toFixed(1));
        const weatherEmojis = getEmojies(avTemp, data.precipitation_sum, data.wind_speed_10m_max);

        setAverageTemperature(avTemp);
        setWeatherEmojis(weatherEmojis);
    }, [data]);

    if (!data || !weatherUnits.temperature) {
        return <div>Données non disponibles</div>;
    }
    const sunriseDate = new Date(data.sunrise); // Convertir la chaîne de caractères en objet Date
    const formattedSunrise = formateDateToHourMinutes(sunriseDate);
    return (
        <div>
            <h2>Aujourd'hui, {data.day}</h2>

            <p>{Emojis.calandar}Date: {data.time}</p>
            <p>Température moyenne: {averageTemperature}°C {weatherEmojis && <div>{weatherEmojis}</div>}</p>
            <p>{Emojis.hot}Température max: {data.temperature_2m_max}°C</p>
            <p>{Emojis.hot}Température min: {data.temperature_2m_min}°C</p>
            <p>{Emojis.sunrise} Lever du soleil: {formattedSunrise}</p>

            <p>{Emojis.rain}Pluie: {data.precipitation_sum} {weatherUnits.rain}</p>
            <p>{Emojis.wind} Vitesse du vent: {data.wind_speed_10m_max} {weatherUnits.wind}</p>

        </div>
    );
};

export default Today;


