import * as actionType from '../constants/actionTypes';

const authReducer = (state = [], action) => {
  switch (action.type) {
    case actionType.FETCH_USERS:
      return action?.payload;
    case actionType.AUTH:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action.data, loading: false, errors: null };
    case actionType.LOGOUT:
      localStorage.clear();
      return { ...state, authData: null, loading: false, errors: null };
    default:
      return state;
  }
};

export default authReducer;
