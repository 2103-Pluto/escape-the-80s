import axios from "axios";

//ACTION CONSTANTS
const SET_RECORDS = "SET_RECORDS"
const ADDED_RECORD = "ADDED_RECORD"

//ACTION CREATORS
export const setRecords = (records) => {
  return {
    type: SET_RECORDS,
    records
  }
}

export const addedRecord = (record) => {
  return {
    type: ADDED_RECORD,
    record
  }
}

//THUNK CREATORS
export const fetchRecords = () => {
  return async (dispatch) => {
    try {
      const { data: records } = await axios.get("/api/records")
      dispatch(setrecords(records))
    } catch (error) {
      console.log(error)
    }
  }
}

export const addRecord = (name, score, level) => {
  return async (dispatch) => {
    try {
      const { data: newRecord } = await axios.post("/api/records", { name, score, level })
      dispatch(addedRecord(newRecord))
    } catch (error) {
      console.log(error)
    }
  }
}

//INITIAL STATE
const initState = {
  allRecords: [],
  newRecordId: 0
}

//RECORDS REDUCER
export default function recordsReducer (state = initState, action) {
  switch (action.type) {
    case SET_RECORDS:
      return { ...state, allRecords: [...action.records]}
    case ADDED_RECORD:
      return { ...state, allRecords: [...allRecords, action.record], newRecordId: action.record.id }
    default:
      return state;
  }
}
