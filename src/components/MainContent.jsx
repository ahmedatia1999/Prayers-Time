import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import image1 from "../images/fajr-prayer.png";
import image2 from "../images/dhhr-prayer-mosque.png";
import image3 from "../images/asr-prayer-mosque.png";
import image4 from "../images/night-prayer-mosque.png";
import image5 from "../images/sunset-prayer-mosque.png";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";
import { useState, useEffect } from "react";
moment.locale("ar");

export default function MainContent() {
  // States

  const [nextPrayerIndex, setNextPrayerIndex] = useState(1);

  const [timings, setTimings] = useState({
    Fajr: "05:04",
    Dhuhr: "12:27",
    Asr: "15:52",
    Maghrib: "18:28",
    Isha: "19:58",
  });

  const [remainingTime, setReaminingTime] = useState("");

  const [city, setCity] = useState({
    DisplayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
  });

  const [today, setToday] = useState("");

  const avilableCities = [
    { DisplayName: "مكة المكرمة", apiName: "Makkah al Mukarramah" },
    { DisplayName: "الرياض", apiName: "Riyadh" },
    { DisplayName: "الدمام", apiName: "Dammam" },
  ];

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Duhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const getTimings = async () => {
    console.log("calling api");
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${city.apiName}`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTimings();
  }, [city]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("Do MMM YYYY | h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [city]);

  // const data = await axios.get(
  //   "https://api.aladhan.com/v1/timingsByCity?city=Dubai&country=United Arab Emirates&method=8"
  // );

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Duhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Duhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);

    // const Isha = timings["Isha"];
    // const IshaMoment = moment(Isha, "hh:mm");
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      const totalDiffrence = midnightDiff + fajrToMidnightDiff;
      remainingTime = totalDiffrence;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setReaminingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );

    console.log(
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );
  };

  const handleChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    setCity(cityObject);
  };
  return (
    <>
      {/* Top Row  */}
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{city.DisplayName}</h1>
          </div>
        </Grid>

        <Grid xs={6}>
          <div>
            <h2>متبقي علي صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/*== Top Row  ==*/}
      <Divider style={{ borderColor: "white", opacity: "0.1" }}></Divider>
      {/* Prayers Cards  */}
      <Stack direction="row" justifyContent={"space-around"} marginTop={"50px"}>
        <Prayer name="الفجر" time={timings.Fajr} image={image1} />
        <Prayer name="الظهر" time={timings.Dhuhr} image={image2} />
        <Prayer name="العصر" time={timings.Asr} image={image3} />
        <Prayer name="المغرب" time={timings.Maghrib} image={image4} />
        <Prayer name="العشاء" time={timings.Isha} image={image5} />
      </Stack>
      {/*== Prayers Cards  ==*/}
      {/* Select City  */}
      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleChange}
          >
            {avilableCities.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city.apiName}>
                  {city.DisplayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
