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
    case types.ADD_PATIENT:
    case types.auth_model:
      return {
        ...state,
        msg: action.payload,
      };
    case types.GET_SINGLE_DOCTOR:
      return {
        ...state,
        doctor: action.payload,
      }
      ;
    case types.GET_DOCTOR:
      return {
        ...state,
        doctors: action.payload,
      };
    case types.GET_PATIENTS:
    case types.SET_PATIENT_VALUE:
      return {
        ...state,
        patients: action.payload,
      }
    case types.GET_RECORDS:
      return{
        ...state,
          records: action.payload,
      }

      ;
    case types.SET_MSG:
      return {
        ...state,
        ...initialState,
      };
    case types.AUTHENTICATE:
      return {
        ...state,
        doctor: action.payload["doctor"] || {},
        msg: action.payload["msg"],
      };
    default:
      return state;
  }
};

export default appReducer;
