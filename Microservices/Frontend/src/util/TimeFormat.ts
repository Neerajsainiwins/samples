import moment, { unitOfTime } from "moment";

export const weekTimeFormat = (startDate?: any, endDate?: any, valueNext?: string, timeDay?: string) => {

    let timeDays = timeDay ? timeDay : 'week';
    
    if (!startDate && !endDate) {
        var weekStartDate = moment().startOf(timeDays as unitOfTime.StartOf).format("ddd MMM DD YYYY HH:mm:ss ZZ");
        var weekEndDate = moment().endOf(timeDays as unitOfTime.StartOf).format("ddd MMM DD YYYY HH:mm:ss ZZ");
        return { startDate: weekStartDate, endDate: weekEndDate };
    }
    else {
        let weekStartDate, weekEndDate
        if (valueNext === "increase") {

            let increaseDate = moment(endDate).add(1, 'days').format("ddd MMM DD YYYY HH:mm:ss ZZ");
            weekStartDate = moment(increaseDate).startOf(timeDays as unitOfTime.StartOf).format("ddd MMM DD YYYY HH:mm:ss ZZ");
            weekEndDate = moment(increaseDate).endOf(timeDays as unitOfTime.StartOf).format("ddd MMM DD YYYY HH:mm:ss ZZ");
            return { startDate: weekStartDate, endDate: weekEndDate };
        }
        else {
            let increaseDate = moment(startDate).subtract(1, 'days').format("ddd MMM DD YYYY HH:mm:ss ZZ");
            weekStartDate = moment(increaseDate).startOf(timeDays as unitOfTime.StartOf).format("ddd MMM DD YYYY HH:mm:ss ZZ");
            weekEndDate = moment(increaseDate).endOf(timeDays as unitOfTime.StartOf).format("ddd MMM DD YYYY HH:mm:ss ZZ");
            return { startDate: weekStartDate, endDate: weekEndDate };
        }

        // return { startDate: weekStartDate, endDate: weekEndDate };
    }
}

export const ArrayOfDates = (startDate: any, number: number) => {
    let days = []
    for (let i = 0; i <= number; i++) {
        days.push(moment(startDate).add(i, 'days').format("ddd MMM DD YYYY HH:mm:ss ZZ"));
    }
    return days;
}

export const DateTimeFormat = (date: any, format: string) => {
    let dateFormat = moment(date).format(format);
    return dateFormat
}