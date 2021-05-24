//ACTION CONSTANTS
const SET_CAMPAIGN_DIFFICULTY = "SET_CAMPAIGN_DIFFICULTY"

//ACTION CREATORS
export const setCampaignDifficulty = (difficulty) => {
  return {
    type: SET_CAMPAIGN_DIFFICULTY,
    difficulty
  }
}

//INITIAL STATE
const initState = {
  campaignDifficulty: 'standard',
}

//SETTINGS REDUCER
export default function recordsReducer (state = initState, action) {
  switch (action.type) {
    case SET_CAMPAIGN_DIFFICULTY:
      return Object.assign({}, state, {campaignDifficulty: action.difficulty})
    default:
      return state;
  }
}
