//todo refactor to follow some kind of structure
const PathConstants = {
  LOGIN: 'login',
  USER_PROFILE: 'myprofile',
  CREATE_ACCOUNT: 'account/create',
  DELETE_ACCOUNT: 'account/delete',
  PERFORM_DELETE_ACCOUNT: 'account/delete/:confirmationToken',
  CONFIRM_REGISTRATION: 'account/confirm',
  FLIGHT_HISTORY: 'flights/history',
  FLIGHT_UPCOMING: 'flights/upcoming',
};

export default PathConstants;
