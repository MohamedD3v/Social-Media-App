export const generateOTP = (): string => {
  return String(Math.floor(Math.random() * (900000 - 100000) + 100000));
};
