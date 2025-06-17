const splitDateAndTime = (dateTime: string, onlyDate: string, onlyTime: string) => {
  if (dateTime === '') return [onlyDate, onlyTime];

  const [datePart, timePart] = dateTime.split('T');
  return [
    datePart, timePart.substring(0, 5)
  ];
};

const joinDateAndTime = (datePart: string, timePart: string) => `${datePart}T${timePart}:00.000Z`;

export {
  splitDateAndTime,
  joinDateAndTime
};
