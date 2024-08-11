// runs after each test cases

afterEach(() => {
  jest.resetModules(); // Clears the cache for require/import
  delete process.env.MONGO_CONNECTION_STRING;
  delete process.env.PORT;
  delete process.env.SERVER_TOKEN_EXPIRETIME;
  delete process.env.SERVER_TOKEN_ISSUER;
  delete process.env.SERVER_TOKEN_SECRET;
  delete process.env.SERVER_HOSTNAME;
});
