import * as types from "./actionType";

const initialState = {
  patients: [],
  patient: {},
  doctors: [],
  doctor: {},
  records: [],
  msg: "",
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_DOCTOR:
      return {
        ...state,
        msg: action.payload,
      };
    case types.GET_SINGLE_DOCTOR:
      return {
        ...state,
        doctor: action.payload,
      }
    default:
      return state;
  }
};

export default appReducer;