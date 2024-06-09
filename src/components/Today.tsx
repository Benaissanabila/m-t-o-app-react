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
        <div className={"max-w-max mx-auto xl:ml-auto"}>
            <div className={"flex mb-20 mt-12 flex-col xl:flex-row"}>
                <div className={"text-3xl font-bold text-center text-blue-950 mt-auto mb-8 xl:mt-auto xl:mb-0"}>
                    <div className={"text-xl ml-12 xl:pl-5 "}>
                        <p className={"text-3xl text-blue-950"}>{weatherEmojis &&
                            <div className={"ml-6 text-5xl"}>{weatherEmojis}</div>} {averageTemperature}°C </p></div>
                    <h2>Aujourd'hui, {data.day}</h2>

                </div>
                <div className={"text-xl ml-12 xl:pl-4 xl:border-l-2 xl:border-indigo-500"}>
                    <p>{Emojis.hot}Température max: {data.temperature_2m_max}°C</p>
                    <p>{Emojis.hot}Température min: {data.temperature_2m_min}°C</p>
                    <p>{Emojis.sunrise} Lever du soleil: {formattedSunrise}</p>

                    <p>{Emojis.rain}Pluie: {data.precipitation_sum} {weatherUnits.rain}</p>
            <p>{Emojis.wind} Vitesse du vent: {data.wind_speed_10m_max} {weatherUnits.wind}</p></div>
        </div>
        </div>
    );
};

export default Today;


