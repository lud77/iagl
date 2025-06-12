import { getRateByRouteFactory } from './getRateByRoute';

const getRateByRoute = getRateByRouteFactory({
  'ABC-DEF': 1,
  '-': 2
});

describe('getRateByRoute', () => {
  it('should return the default value when the route is missing', () => {
    expect(getRateByRoute('ZYX-WVU')).toBe(2);
  });

  it('should return the correct value if it\'s present', () => {
    expect(getRateByRoute('ABC-DEF')).toBe(1);
  });
});
