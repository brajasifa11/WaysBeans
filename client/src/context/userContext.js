import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: {},
  cartList: null,
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'AUTH_SUCCESS':
    case 'LOGIN_SUCCESS':
      // localStorage.setItem('token', payload.token);
      // localStorage.setItem('role', payload.role);
      return {
        isLogin: true,
        user: payload,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return {
        isLogin: false,
        user: {},
      };
    case 'GET_CART':
      return {
        cartList: payload,
      }
    default:
      throw new Error();
  };
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};