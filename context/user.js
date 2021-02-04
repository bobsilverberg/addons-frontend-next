import { createContext, useContext, useReducer } from 'react';

export const FINISH_UPDATE_USER_ACCOUNT = 'FINISH_UPDATE_USER_ACCOUNT';
export const UPDATE_USER_ACCOUNT = 'UPDATE_USER_ACCOUNT';
export const LOG_IN_USER = 'LOG_IN_USER';
export const LOG_OUT_USER = 'LOG_OUT_USER';
export const LOAD_CURRENT_USER_ACCOUNT = 'LOAD_CURRENT_USER_ACCOUNT';
export const FETCH_USER_ACCOUNT = 'FETCH_USER_ACCOUNT';
export const LOAD_USER_ACCOUNT = 'LOAD_USER_ACCOUNT';
export const DELETE_USER_PICTURE = 'DELETE_USER_PICTURE';
export const FETCH_USER_NOTIFICATIONS = 'FETCH_USER_NOTIFICATIONS';
export const LOAD_USER_NOTIFICATIONS = 'LOAD_USER_NOTIFICATIONS';
export const DELETE_USER_ACCOUNT = 'DELETE_USER_ACCOUNT';
export const UNLOAD_USER_ACCOUNT = 'UNLOAD_USER_ACCOUNT';
export const UNSUBSCRIBE_NOTIFICATION = 'UNSUBSCRIBE_NOTIFICATION';
export const ABORT_UNSUBSCRIBE_NOTIFICATION = 'ABORT_UNSUBSCRIBE_NOTIFICATION';
export const FINISH_UNSUBSCRIBE_NOTIFICATION =
  'FINISH_UNSUBSCRIBE_NOTIFICATION';

const UserContext = createContext();

const initialState = {
  currentUserID: null,
  isUpdating: false,
  userPageBeingViewed: {
    loading: false,
    userId: null,
  },
  currentUserWasLoggedOut: false,
  resetStateOnNextChange: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOG_IN_USER:
      return {
        ...state,
        currentUserID: action.payload.user.id,
        currentUserWasLoggedOut: false,
      };

    case LOG_OUT_USER:
      return { ...state, currentUserID: null, currentUserWasLoggedOut: true };

    default:
      return state;
  }
};

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ dispatch, state }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);

export default UserProvider;
