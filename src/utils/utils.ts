export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface WeatherUnits {
    rain?: string;
    temperature?: string;
    wind?: string;
}

export interface WeatherData {
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        sunrise: string[];
        sunset: string[];
        precipitation_sum: number[];
        wind_speed_10m_max: number[];
    };
    daily_units: {
        precipitation_sum: string;
        temperature_2m_max: string;
        wind_speed_10m_max: string;
    };
}

export interface DailyData {
    day: string;
    time: string;
    temperature_2m_max: number;
    temperature_2m_min: number;
    sunrise: string;
    sunset: string;
    precipitation_sum: number;
    wind_speed_10m_max: number;
}


export const formatWeatherDataDaily = (data: WeatherData['daily']): DailyData[] => {
    const dataDaily: DailyData[] = [];

    for (let i = 0; i < data.time.length; i++) {
        const dailyEntry: DailyData = {
            day: getFrenchDay(data.time[i]),
            time: data.time[i],
            temperature_2m_max: data.temperature_2m_max[i],
            temperature_2m_min: data.temperature_2m_min[i],
            sunrise: data.sunrise[i],
            sunset: data.sunset[i],
            precipitation_sum: data.precipitation_sum[i],
            wind_speed_10m_max: data.wind_speed_10m_max[i],
        };
        dataDaily.push(dailyEntry);
    }
    return dataDaily;
};

export const getFrenchDay = (dateString: string): string => {
    const date = new Date(dateString);
    const dayIndex = date.getDay() ;
    const frenchDays = [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
    ];
    return frenchDays[dayIndex];
};



