import { useMemo, useState } from 'react';
import axios from 'axios';
import type { SearchType } from '../types';
import { z } from 'zod';
// import { number, object, string, Output, parse } from 'valibot';
//Zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number(),
    })
})
export type Weather = z.infer<typeof Weather>;


// Valibot
// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number(),
//     })
// })

// type Weather = Output<typeof WeatherSchema>
 const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
 }

function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState);
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async (search: SearchType) => {

        const appId = import.meta.env.VITE_API_KEY;
        setLoading(true);
        setWeather(initialState);
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
            const { data } = await axios(geoUrl);
            // comprobar si existe
            if(!data[0]) {
                setNotFound(true);
                return
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

            // const { data: weatherResult } = await axios(weatherUrl);

            // console.log(weatherResult);

            // Zod
            const { data: weatherResult } = await axios(weatherUrl);
            const result = Weather.safeParse(weatherResult);
            if(result.success) {
                setWeather(result.data);
            }

            // Valibot
            // const { data: weatherResult } = await axios(weatherUrl);
            // const result = parse(WeatherSchema, weatherResult);
            // console.log(result);


        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const hasWeatherData = useMemo(() => weather.name , [weather])

    return {
        weather,
        loading,
        fetchWeather,
        hasWeatherData,
        notFound
    }
}


export default useWeather;