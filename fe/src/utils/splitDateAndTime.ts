const splitDateAndTime = (dateTime: string, onlyDate: string, onlyTime: string) => {
  if (dateTime === '') return [onlyDate, onlyTime];

  const [datePart, timePart] = dateTime.split('T');
  return [
    datePart, timePart.substring(0, 5)
  ];
};

export default splitDateAndTime;
