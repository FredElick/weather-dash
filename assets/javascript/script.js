var listEl=document.getElementById("prior-search");
var cityEl=document.getElementById("city");
var tempEl=document.getElementById("temp");
var windEl=document.getElementById("wind");
var humidEl=document.getElementById("humidity");
var uvEl=document.getElementById("uv");
var cityInputEl=document.getElementById("city-input");
var submitButton=document.getElementById("search");

if(localStorage.getItem('cityList')){
    var cityList=JSON.parse(localStorage.getItem('cityList'));
    for(var i=0; i<cityList.length; i++){
        var cityButton=document.createElement("button");
        cityButton.textContent=cityList[i];
        listEl.appendChild(cityButton);
    }}
    else{
        var cityList=[];
    }

var dateConvert=function(date){
    let day5=new Date(date*1000);
               var month=day5.getMonth()+1;
               var year=day5.getFullYear();
               var mmddyy="("+month+"/"+day+"/"+year+")";
               return mmddyy;
}
var today=new Date();
               var day=today.getDate();
               var month=today.getMonth()+1;
               var year=today.getFullYear();
               var mmddyy="("+month+"/"+day+"/"+year+")";

var getCity = function(city){
    var apiUrl="https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid=4dd0a6688f34e28f1c3c6421ee81985c";
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                var lat=data[0].lat;
                var long=data[0].lon;
                getWeather(lat,long);
                console.log(data);
                cityEl.textContent=data[0].name+", "+data[0].state+mmddyy;
            })
        }
    })
}

var getWeather= function(lat, long){
    apiUrl="https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&units=imperial&exclude=hourly&appid=4dd0a6688f34e28f1c3c6421ee81985c";
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                tempEl.textContent="Temp: " + data.current.temp +"F";
                windEl.textContent="Wind: "+data.current.wind_speed+" MPH";
                humidEl.textContent="Humidity: "+ data.current.humidity+ "%";
                uvEl.textContent=data.current.uvi;
                uvEl.classList.remove("bg-success");
                uvEl.classList.remove("bg-warning");
                uvEl.classList.remove("bg-danger");
                if(uvEl.textContent<4){

                    uvEl.classList.add("bg-success")
                }else if(uvEl.textContent<8){
                    uvEl.classList.add("bg-warning")
                }
                else{
                    uvEl.classList.add("bg-danger")
                }
                console.log(data);

                for(var i=1; i<6; i++){
                    let weatherDay=data.daily[i-1];
                    console.log(weatherDay);
                    console.log(dateConvert(data.daily[i-1].dt));
                    var dayEl=document.getElementById("plus-"+i);
                        while(dayEl.firstChild){
                            dayEl.removeChild(dayEl.firstChild)
                        }

                    var date=document.createElement("p");
                    date.textContent=dateConvert(weatherDay.dt);
                    var symbol=document.createElement("img");
                    symbol.src="https://openweathermap.org/img/wn/"+ weatherDay.weather[0].icon +"@2x.png";
                    var temp=document.createElement("p");
                    temp.textContent="Temp: "+ weatherDay.temp.day + " F"
                    var wind=document.createElement("p");
                    wind.textContent="Wind: "+ weatherDay.wind_speed;
                    var humidity=document.createElement("p");
                    humidity.textContent="Humidity: "+ weatherDay.humidity + "%"
                    dayEl.appendChild(date);
                    dayEl.appendChild(symbol);
                    dayEl.appendChild(temp);
                    dayEl.appendChild(wind);
                    dayEl.appendChild(humidity);

                }

            })
        }
    })
}

var updateList= function(city){
    cityList.push(city);
    localStorage.setItem('cityList',JSON.stringify(cityList));
        var cityButton=document.createElement("button");
        cityButton.textContent=city;
        listEl.appendChild(cityButton);
    }

var formSubmitHandler=function(event){
    event.preventDefault();
    var city=cityInputEl.value.trim();
    console.log("this works");
    if(city){
        getCity(city);
        updateList(city);
    }else{
        alert("Please enter a city")
        
    }
    console.log(event);
};

submitButton.addEventListener("click",formSubmitHandler);

listEl.addEventListener("click",function(event){
    var cityName=event.target.textContent;
    getCity(cityName);
  })



