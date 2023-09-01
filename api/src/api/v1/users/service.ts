import logger from '../../../utils/logger';
import { hashPassword } from '../../../utils/passwordUtils';
import { IUser } from './interfaces';
import { User } from './model';

const findUserById = async (id: number) => {
  const user = await User.findOneBy({ id });
  return user;
};

const findUserByPhone = async (phone: string) => {
  try {
    const user = await User.findOneBy({ phone });
    return user;
  } catch (error) {
    logger.error(`${error.name}: ${error.message}`);
    return null;
  }
};

const saveUser = async (hashedPassword: string) => {
  const newUser = User.create({
    password: hashedPassword,
  });

  const user = await User.save(newUser);
  return user;
};

const updateUserPassword = async (userObj: IUser, password: string) => {
  const hashedPassword = await hashPassword(password);
  await User.save({
    ...userObj,
    password: hashedPassword,
  });
};

export { findUserById, findUserByPhone, saveUser, updateUserPassword };
