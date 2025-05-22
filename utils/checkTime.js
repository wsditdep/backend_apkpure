import moment from 'moment';
import 'moment-timezone';

async function checkTimeFunction(setting) {

    if (!setting || !setting.rechargeTimeStart || !setting.rechargeTimeEnd) {
        throw new Error("Invalid setting: rechargeTimeStart and rechargeTimeEnd are required.");
    }

    const instantDateAlt = new Date();
    const instantDate = moment.tz(instantDateAlt, process.env.TIMWZONE).format('HH');

    const convertToCanadaTime = (hour) => {
        console.log("hr", hour)
        const timeInCanada = moment.tz(`${hour}:00`, 'HH:mm', process.env.TIMWZONE)
        return parseInt(timeInCanada);
    };

    const startHourNum = convertToCanadaTime(parseInt(setting?.rechargeTimeStart?.slice(0, 2)));
    const endHourNum = convertToCanadaTime(parseInt(setting?.rechargeTimeEnd?.slice(0, 2)));
    const currentHourNum = parseInt(instantDate);

    console.log("startHourNum---", startHourNum)
    console.log("endHourNum---", endHourNum)
    console.log("currentHourNum---", currentHourNum)

    if ((startHourNum > endHourNum && (currentHourNum >= startHourNum || currentHourNum < endHourNum)) ||
        (startHourNum < endHourNum && currentHourNum >= startHourNum && currentHourNum < endHourNum)) {
        // Within business hours
        return true;
    } else {
        // Outside of business hours
        return false;
    }
}

export default checkTimeFunction;
