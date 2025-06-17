const splitDateAndTime = (dateTime: string) => {
  const [datePart, timePart] = dateTime.split('T');
  return [datePart, timePart.substring(0, 5)];
};

const joinDateAndTime = (datePart: string, timePart: string) => `${datePart}T${timePart}:00.000Z`;

export {
  splitDateAndTime,
  joinDateAndTime
};
