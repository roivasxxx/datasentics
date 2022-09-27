import React, { useState, forwardRef, useRef, isValidElement } from "react";
import Icon from "./Icon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DefaultResult = { sunrise: null, sunset: null };

export default function MainComponent({}) {
  const [data, setData] = useState({
    lat: 0,
    leng: 0,
    date: new Date(),
    country: "",
  });
  const [resultData, setResultData] = useState(DefaultResult);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const geoapifyKey = "745948cd47c24850a141e2308b5bacad";
    /**
     * https://api.geoapify.com/v1/geocode/search?country=Czech%20Republic&apiKey=745948cd47c24850a141e2308b5bacad
     */
    const geoapifyReq = await fetch(
      `https://api.geoapify.com/v1/geocode/search?country=${data.country.replace(
        " ",
        "%20"
      )}&apiKey=${geoapifyKey}`,
      {
        method: "GET",
      }
    );
    const result = await geoapifyReq.json();

    if (result?.statusCode === 400 || result?.features?.length === 0) {
      setResultData(DefaultResult);
      setIsLoading(false);
      return;
    }

    console.log(result?.features[0]?.properties);
    const { lat, lon } = result.features[0].properties;
    console.log(lat, lon);

    //https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400
    const sunApiReq = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${
        data.date.toISOString().split("T")[0]
      }`
    );
    const sunApiResult = await sunApiReq.json();
    console.log(sunApiResult);
    const { sunset, sunrise } = sunApiResult.results;
    setResultData({ sunset, sunrise });
    setIsLoading(false);
  };

  const PickerInput = forwardRef(({ value, onClick }, ref) => (
    <div
      className={`custom-input p-2.5 border-2 ${
        isOpen ? "border-sky-500" : "border-slate-300"
      } rounded-lg `}
    >
      <button
        onClick={() => {
          onClick();
          // if (isOpen === null) setIsOpen(false);
          // else
          // setIsOpen(!isOpen);
        }}
        ref={ref}
      >
        {value}
      </button>
    </div>
  ));
  console.log("component?", isOpen);

  const handlePickerClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="flex flex-row md:flex-col mt-10">
        <div className="flex flex-row items-center  md:mb-2">
          <DatePicker
            popperProps={{
              strategy: "fixed",
            }}
            open={isOpen}
            selected={data.date}
            onChange={(newDate) => {
              setData({ ...data, date: newDate });
              setIsOpen(false);
            }}
            customInput={<PickerInput />}
            onClickOutside={() => {
              console.log("outside click");
              setIsOpen(null);
            }}
            onInputClick={() => {
              console.log("input click");
              handlePickerClick();
            }}
          />
          <Icon size={24} iconName="calendar" style="p-1.5" />
        </div>
        <div>
          <input
            type="text"
            id="first_name"
            className="bg-white border-2 border-slate-300  text-sm rounded-lg focus:outline-sky-500 block w-full h-full p-2.5"
            placeholder="Country name"
            required
            onInput={(e) => setData({ ...data, country: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-10">
        <button
          className="flex flex-row p-2.5 items-center border-2 border-slate-300 rounded-lg h-full"
          onClick={handleClick}
        >
          <Icon size={24} iconName="sun" style="p-1.5" />
          Show
        </button>
      </div>
      <div className="h-6 my-2.5">
        {isLoading ? (
          <div>
            <Icon style="animate-spin h-5 w-5 mr-3" iconName="sun" size={24} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {resultData?.sunrise ? (
        <div className="flex flex-col items-center border-t-2 border-slate-300 w-8/12">
          {["Sunrise", "Sunset"].map((el) => (
            <div key={`div-${el}`} className="flex flex-row my-2.5">
              <Icon
                size={24}
                iconName={el === "Sunrise" ? "sun" : "moon"}
                style="pr-1.5"
              />
              <div>
                {el} is at {resultData[el.toLowerCase()]}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
