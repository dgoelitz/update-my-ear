const GetDate = ((date, count) => {
  const months = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  };

  let year = date.substr(0, 4);
  let month = months[date.substr(4, 2)];
  let day = date.substr(6, 2);
  let suffix = 'th';
  if (day[1] === '1') suffix = 'st';
  if (day[1] === '2') suffix = 'nd';
  if (day[1] === '3') suffix = 'rd';
  if (day[0] === '1') suffix = 'th';
  return `${month} ${day}${suffix}, ${year} (${count})`;
});

export default GetDate;