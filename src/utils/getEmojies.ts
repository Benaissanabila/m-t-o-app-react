import {Emojis}from "./emojies"

export const getEmojies = (temperature: number ,precipitation :number,windspeed:number): string => {
    let weather = "";

    if (temperature <= 0) {
        weather += Emojis.cold;
    }
    else if (temperature >=25){
        weather+= Emojis.hot;
    }
    if(precipitation === 0){
        weather +=Emojis.sun;
    } else if (precipitation>=3){
        weather += Emojis.rain;
    } else{
        weather += Emojis.cloud;
    }
    if(windspeed>=25){
        weather +=Emojis.wind
    }
    return weather;
}