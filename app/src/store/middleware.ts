import types from "./actionTypes";
import { login, fileUpload, getDirectory, getSeedPhrase } from "../store/services/fairOS";

export const applyMiddleware = (dispatch) => (action) => {
  switch (action.type) {
    case types.LOGIN_USER.USER_LOGIN_REQUEST:
      return login(action.payload)
        .then((res) => {
          dispatch({
            type: types.LOGIN_USER.USER_LOGGED_SUCCESS,
            payload: res,
          });
          dispatch({
            type: types.SET_SYSTEM,
            payload: action.payload,
          })
        })
        .catch((err) =>
          dispatch({
            type: types.LOGIN_USER.USER_LOGGED_FAILED,
            payload: err.response,
          })
        );
    case types.SEND_FILE.SEND_FILE_REQUEST:
      return fileUpload(action.payload).then((res) => {
        dispatch({
          type: types.SEND_FILE.FILE_SENT_SUCCESS,
          payload: res,
        });
      })
        .catch((err) =>
          dispatch({
            type: types.SEND_FILE.SENDING_FILE_FAILED,
            payload: err.response,
          })
        );
    case types.GET_DIRECTORY.GET_DIRECTORY_REQUEST:
      return getDirectory(action.payload).then((res) => {
        dispatch({
          type: types.GET_DIRECTORY.GET_DIRECTORY_SUCCESS,
          payload: res,
        });
      })
    case types.STORE_USER_REGISTRATION_INFO:
      dispatch({
        type: types.SEED_PHRASE.SEED_PHRASE_REQUEST,
        payload: {},
      })
    case types.SEED_PHRASE.SEED_PHRASE_REQUEST:
      return getSeedPhrase().then((res) => {
        dispatch({
          type: types.SEED_PHRASE.SEED_PHRASE_SUCCESS,
          payload: res,
        });
      })
        .catch((err) =>
          dispatch({
            type: types.SEED_PHRASE.SEED_PHRASE_FAILED,
            payload: err.response,
          }))
    default:
      dispatch(action);
  }
};
