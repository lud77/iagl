import Joi from 'joi';

const AIRPORT_CODE_REGEX = /^[A-Z]{3}$/;
const CURRENCY_REGEX = /^[A-Z]{3}$/;

export default
  Joi
    .object({
      DepartureAirportCode: Joi.string().pattern(AIRPORT_CODE_REGEX).required(),
      ArrivalAirportCode: Joi.string().pattern(AIRPORT_CODE_REGEX).required(),
      DepartureTime: Joi.string().isoDate().required(),
      ArrivalTime: Joi.string().isoDate().required(),
      Price: Joi.number().positive().precision(2).required(),
      Currency: Joi.string().pattern(CURRENCY_REGEX).required()
    })
    .custom((value, helpers) => { // Additional checks
      const depTime = new Date(value.DepartureTime);
      const arrTime = new Date(value.ArrivalTime);

      // arrTime must be after depTime
      if (depTime >= arrTime) return helpers.error('custom.arrivalBeforeDeparture');

      // airports must be different
      if (value.DepartureAirportCode === value.ArrivalAirportCode) return helpers.error('custom.sameAirports');

      // depTime must be in the future
      const now = new Date();
      if (depTime <= now) return helpers.error('custom.departureInPast');

      return value;
    })
    .messages({
      'custom.arrivalBeforeDeparture': 'Arrival time should be after Departure time',
      'custom.sameAirports': 'Arrival and Destination should not be the same airport',
      'custom.departureInPast': 'Departure time should be in the future'
    });
