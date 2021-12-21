export function dateInPast(daysAgo) {
    return (Date.now() - (1000 * 60 * 60 * 24 * daysAgo));
}

export function hoursPast(hours) {
    return (Date.now() - (1000 * 60 * 60 * hours));
}

export function now() {
    return Date.now();
}

export function niceDate(millseconds) {
    let date = new Date(millseconds);
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

export function milliToString(milliseconds) {
    let seconds = Math.floor(milliseconds/1000);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    let days = Math.floor(hours/24);

    seconds = seconds - minutes*60;
    minutes = minutes - hours*60;
    hours = hours - days*24;

    let time = "";

    if(days > 0) {
        time += days + " ";
    }

    time += hours + ":";

    if(minutes < 10) {
        time += "0" + minutes;
    }
    else {
        time += minutes
    }
    time += ":";


    time += (seconds<10)?"0"+seconds:seconds;

    return time;
}