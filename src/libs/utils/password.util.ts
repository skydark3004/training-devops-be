import bcryptjs from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
  const isCorrectPassword = await bcryptjs.compare(plainPassword, hashedPassword);
  return isCorrectPassword;
};
