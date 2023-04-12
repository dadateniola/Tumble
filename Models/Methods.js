function getTimeDifference(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // calculate time differences in milliseconds
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    // calculate time differences in respective units
    const elapsed = {
        years: Math.floor(diff / msPerYear),
        months: Math.floor(diff / msPerMonth),
        days: Math.floor(diff / msPerDay),
        hours: Math.floor(diff / msPerHour),
        minutes: Math.floor(diff / msPerMinute),
        seconds: Math.floor(diff / 1000),
    };

    // format the time difference
    if (elapsed.years > 0) {
        return `${elapsed.years} year ago`;
    } else if (elapsed.months > 0) {
        return `${elapsed.months} months ago`;
    } else if (elapsed.days > 0) {
        return `${elapsed.days} days ago`;
    } else if (elapsed.hours > 0) {
        return `${elapsed.hours} hours ago`;
    } else if (elapsed.minutes > 0) {
        return `${elapsed.minutes} minutes ago`;
    } else {
        return `${elapsed.seconds} seconds ago`;
    }
}

function formatDate(dbDate) {
    // Parse the date string from the database into a Date object
    const date = new Date(dbDate);

    // Get the day, month and year from the date object
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month starts from 0, so add 1 to get the actual month number
    const year = date.getFullYear();

    // Combine the day, month and year into a string in the desired format (dd/mm/yyyy)
    const formattedDate = `${day}/${month}/${year}`;

    // Use the formatted date wherever needed
    return formattedDate; // Output: "31/3/2023"

}

module.exports = { getTimeDifference, formatDate };