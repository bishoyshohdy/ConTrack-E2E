export function getContent (time) {
    let restOfTime = time.split('h')[1];
    const hours = time.split('h')[0];
    let mins = '0';
    if (restOfTime.trim().length !== 0) {
        mins = restOfTime.split('m')[0];
        restOfTime = restOfTime.split('m')[1];
    }
    let seconds = '0';
    if (restOfTime.trim().length !== 0) {
        seconds = restOfTime.split('s')[0];
    }
    return [hours, mins, seconds];
}

export function getTotalSeconds (time) {
    time = getContent(time);
    return Number(time[0]) * 60 * 60 + Number(time[1]) * 60 + Number(time[2]);
}

export function sortTimes (times) {
    times = times.map((time) => { return getTotalSeconds(time); });
    const oldTimes = [...times];
    const sortedTimes = oldTimes.sort();
    const sortedIndicies = [];
    sortedTimes.forEach(item => {
        sortedIndicies.push(times.indexOf(item));
    });
    return sortedIndicies;
}

export function sumOfTimes (times) {
    times = times.map((time) => { return getTotalSeconds(time); });
    let sum = 0;
    times.forEach(time => {
        sum += time;
    });
    return sum;
}

export function diffBetweenTimes (time1, time2) {
    return getTotalSeconds(time1) - getTotalSeconds(time2);
}
