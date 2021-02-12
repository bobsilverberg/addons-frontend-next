import { createContext, useContext, useReducer } from 'react';

import { ALL_SUPER_POWERS, STATS_VIEW } from '../constants';

export const LOG_IN_USER = 'LOG_IN_USER';
export const LOG_OUT_USER = 'LOG_OUT_USER';

const UserContext = createContext();

function getCurrentUserId(state) {
  const { currentUser } = state;

  return (currentUser && currentUser.id) || null;
}

function hasPermission(state, permission) {
  const { currentUser } = state;

  // If the user isn't authenticated, they have no permissions.
  if (!currentUser) {
    return false;
  }

  const { permissions } = currentUser;
  if (!permissions) {
    return false;
  }

  // Admins have absolutely all permissions.
  if (permissions.includes(ALL_SUPER_POWERS)) {
    return true;
  }

  // Match exact permissions.
  if (permissions.includes(permission)) {
    return true;
  }

  // See: https://github.com/mozilla/addons-frontend/issues/8575
  const appsWithAllPermissions = permissions
    // Only consider permissions with wildcards.
    .filter((perm) => perm.endsWith(':*'))
    // Return the permission "app".
    // See: https://github.com/mozilla/addons-server/blob/3a15aafb703349923ee2eb9a9f7b527ba9b16c03/src/olympia/constants/permissions.py#L4
    .map((perm) => perm.replace(':*', ''));

  const app = permission.split(':')[0];

  return appsWithAllPermissions.includes(app);
}

const initialState = {
  currentUser: null,
  isUpdating: false,
  userPageBeingViewed: {
    loading: false,
    userId: null,
  },
  currentUserWasLoggedOut: false,
  resetStateOnNextChange: false,
  getCurrentUserId,
  hasPermission,
};

// This is just a fake user for playing around with using this reducer.
const testUser = {
  id: 123,
  permissions: [STATS_VIEW],
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOG_IN_USER:
      return {
        ...state,
        currentUser: testUser,
        currentUserWasLoggedOut: false,
      };

    case LOG_OUT_USER:
      return { ...state, currentUser: null, currentUserWasLoggedOut: true };

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

export const useUserState = () => useContext(UserContext);

export default UserProvider;
