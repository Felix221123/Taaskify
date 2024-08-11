// myModule.test.ts

// mapping in the mock validate env
jest.mock("../src/utils/validateEnv")

// Now import the module that relies on these environment variables
import config from '../src/Config/config'; // or wherever your config file is located


test('should have correct config values', () => {
  expect(config.server.hostname).toBe('mockHostname');
  expect(config.server.port).toBe(3000);
  expect(config.server.token.expireTime).toBe(3600);
  expect(config.server.token.issuer).toBe('mockIssuer');
  expect(config.server.token.secret).toBe('mockSecret');
});
