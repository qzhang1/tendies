const Providers = {
  AlphaVantage: { rateLimit: 500, interval: 86400 },
  IEX: { rateLimit: 100, interval: 1000 },
  Finnhub: { rateLimit: 30, interval: 1000 },
};

export default Providers;
