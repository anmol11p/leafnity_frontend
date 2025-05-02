const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, [action.payload]: true };

    case "STOP_LOADING":
      return { ...state, [action.payload]: false };
    default:
      return state;
  }
};
export { reducer };
