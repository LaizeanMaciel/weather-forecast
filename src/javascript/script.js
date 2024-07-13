
document.querySelector('#search').addEventListener('submit', async (event) =>{
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value

    if (!cityName) {
        document.querySelector('#weather').classList.remove('show')
        showAlert('Por favor, digite uma cidade!')
        return
    }

    const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c'
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`

    const results = await fetch(apiUrl)
    const json = await results.json()

   if (json.cod === 200) {
    const currentTime = new Date();
    const localTime = new Date(currentTime.getTime() + json.timezone * 1000);
    const hours = localTime.getUTCHours();


        showInfo({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            description: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
            condition: json.weather[0].main.toLowerCase(),  // Adiciona a condição climática
            isDaytime: hours >= 6 && hours < 18  // Adiciona verificação de dia ou noite
        });
   } else {
    document.querySelector('#weather').classList.remove('show')
    showAlert(`
        Não foi possivel localizar...

        <img src="src/images/404.svg"/>
        `)
    
   }
})

function showInfo(json) {
    showAlert('')

    document.querySelector('#weather').classList.add('show')
    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',' )} <sup>C°</sup>`
    document.querySelector('#temp_description').innerHTML = `${json.description}`
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`)

     document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',' )} <sup>C°</sup>`
     document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',' )} <sup>C°</sup>`
     document.querySelector('#humidity').innerHTML = `${json.humidity}%`
     document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)}km/h`

     changeBackground(json.condition, json.isDaytime);
}

function changeBackground (condition, isDaytime) {
    const body = document.body
    const audio = document.querySelector('#weatherMusic')
    const audioSource = document.querySelector('#weatherMusicSource')

    body.classList.remove(
        'clear-day', 'clear-night', 'clouds-day', 'clouds-night', 'rain-day', 'rain-night',
        'snow-day', 'snow-night', 'thunderstorm-day', 'thunderstorm-night', 'drizzle-day', 'drizzle-night',
        'mist-day', 'mist-night', 'smoke-day', 'smoke-night', 'haze-day', 'haze-night',
        'dust-day', 'dust-night', 'fog-day', 'fog-night', 'sand-day', 'sand-night',
        'ash-day', 'ash-night', 'squall-day', 'squall-night', 'tornado-day', 'tornado-night')

    const timeSuffix = isDaytime ? '-day' : '-night'
    switch (condition) {
            case 'clear':
            body.classList.add(`clear${timeSuffix}`)
            audioSource.src = 'silva.mp3'
            break

            case 'rain':
            body.classList.add(`rain${timeSuffix}`)
            audioSource.src = 'chuva.MP3'
            break

            case 'clouds':
            body.classList.add(`clouds${timeSuffix}`)
            audioSource.src = 'anavi.mp3'
            break

            case 'snow':
            body.classList.add('snow')
            break

            default:
                body.classList.add('default')
    }

    audio.load();
    audio.play();
    audio.volume = 0.3;
    audio.style.display = 'block'
   
}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg
}

