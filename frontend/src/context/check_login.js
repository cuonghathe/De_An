export const isLoggedIn = () => {
  return !!localStorage.getItem('authToken');
};

export default isLoggedIn;