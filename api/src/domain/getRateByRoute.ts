const getRateByRouteFactory = (rates: Record<string, number>) => (route: string): number => {
  if (rates[route] != null) return rates[route];
  return rates['-'];
};

export { getRateByRouteFactory };
