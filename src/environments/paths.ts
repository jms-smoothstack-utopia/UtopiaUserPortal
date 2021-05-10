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
  TICKET_DETAIL: 'tickets/:id',
  PAYMENT_METHODS_LIST: 'account/payment-methods',
  PAYMENT_METHODS_CREATE: 'account/payment-methods/new',
  PAYMENT_METHODS_DETAIL: 'account/payment-methods/:id',
};

export default PathConstants;
