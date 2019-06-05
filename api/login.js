export function login({
  phoneNumber,
  securityCode,
}) /**: Promise<{authToken: string}> */ {
  console.log(
    `Login request (phoneNumber: ${phoneNumber}, securityCode: ${securityCode})`
  );
  // TODO: integrate with server
  // For now, 50% resolve in 1s, 25% resolve in 2s, 25% fail in 0.5s
  return new Promise((resolve, reject) => {
    const val = Math.random();
    if (val < 0.5) {
      setTimeout(() => {
        resolve({ authToken: 'TestToken' });
      }, 1000);
    } else if (val < 0.75) {
      setTimeout(() => {
        resolve({ authToken: 'TestToken' });
      }, 2000);
    } else {
      setTimeout(() => {
        reject({ errorMessage: 'TestError' });
      }, 500);
    }
  });
}
