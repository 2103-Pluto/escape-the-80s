//ACTION CONSTANTS
const SET_CAMPAIGN_DIFFICULTY = "SET_CAMPAIGN_DIFFICULTY"
const SET_PLAYER_WON = "PLAYER_WON"

//ACTION CREATORS
export const setCampaignDifficulty = (difficulty) => {
  return {
    type: SET_CAMPAIGN_DIFFICULTY,
    difficulty
  }
}

export const setPlayerVictory = (binary) => {
  return {
    type: SET_PLAYER_WON,
    binary
  }
}

//INITIAL STATE
const initState = {
  campaignDifficulty: 'standard',
  playerWon: false,
}


//SETTINGS REDUCER
export default function recordsReducer (state = initState, action) {
  switch (action.type) {
    case SET_CAMPAIGN_DIFFICULTY:
      return Object.assign({}, state, {campaignDifficulty: action.difficulty})
    case SET_PLAYER_WON:
      return Object.assign({}, state, {playerWon: action.binary})
    default:
      return state;
  }
}
