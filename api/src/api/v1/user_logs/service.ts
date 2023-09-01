import ErrorHandler from '../../../utils/ErrorHandler';
import { IUser } from '../users/interfaces';
import { findUserById, findUserByPhone } from '../users/service';
import { UserLog } from './model';

const saveUserLog = async (
  logs: Array<{
    post_id: number | undefined;
    transaction: string | undefined;
    user: string | undefined;
    activity: string;
  }>,
) => {
  const newPostLogs = logs.map((log) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { post_id, user, transaction, activity } = log;
    return UserLog.create({ post_id, transaction, user, activity });
  });
  await UserLog.save(newPostLogs);
};

const fetchLogsByUser = async (user: string, offset: number) => {
  let userObj: IUser | any;
  if (user.length < 8) {
    userObj = await findUserById(parseInt(user, 10));
  } else {
    userObj = await findUserByPhone(user);
  }

  if (!userObj) throw new ErrorHandler(401, 'User not found for the log');
  const [logs, count]: any = await UserLog.findAndCount({
    where: [{ user: userObj.phone }, { user: userObj.id.toString() }],
    order: { created_at: 'DESC' },
    skip: offset,
    take: 50,
  });

  logs?.forEach((log: { publish_date: any; created_at: { toISOString: () => string | any[] } }) => {
    // eslint-disable-next-line no-param-reassign
    log.publish_date = log.created_at;
  });

  const totalPages = Math.ceil(count / 50);
  const response = { logs, totalPages, totalResults: count };

  return response;
};

const updatePhoneOfLogs = async (prevPhone: string, newPhone: string) => {
  await UserLog.update({ user: prevPhone }, { user: newPhone });
};

export { saveUserLog, fetchLogsByUser, updatePhoneOfLogs };
