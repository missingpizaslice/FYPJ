import * as types from "./actionType";
import axios from "axios";

const API = "http://localhost:5000";

const doctorAdded = (msg) => ({
    type: types.ADD_DOCTOR,
    payload: msg,
  });

export const addDoctor = (doctor) => {
    return function (dispatch) {
      axios
        .post(`${API}/api/doctor`, doctor)
        .then((resp) => {
          dispatch(doctorAdded(resp.data.msg));
        })
        .catch((err) => console.log(err));
    };
  };