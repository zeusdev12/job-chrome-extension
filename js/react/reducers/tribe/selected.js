import * as ActionTypes from '../../actions/tribe'

const initialState = {
  originalTribe:[],
  teamMembers: [],
  tribeMembers: [],
  tribeMembersDetails: [],
  isAdding: false,
  isLoadingTeam: false,
  isEditing: false,
  isLoading: false
}

const selected = (state = initialState, action) => {

  switch (action.type) {

    case ActionTypes.FETCH_TEAM_MEMBERS_LIST:
      return { ...state, isLoadingTeam: true }

    case ActionTypes.FETCH_TEAM_MEMBERS_LIST_SUCCESS:

      return { ...state, teamMembers: action.payload.data, isLoadingTeam: false }

    case ActionTypes.FETCH_TEAM_MEMBERS_LIST_FAILURE:
      return action.payload

    case ActionTypes.FETCH_TRIBE_MEMBERS_LIST:
      return { ...state, isLoading:true }

    case ActionTypes.FETCH_TRIBE_MEMBERS_LIST_SUCCESS:

      return {
       
        ...state,
        isLoading:false,
        originalTribe:action.payload.members,
        tribeMembers: action.payload.members,
        teamMembers: state.teamMembers.filter(member => !action.payload.members.map(item => item.userId).includes(member.userId)),
        tribeMembersDetails: action.payload.members
      }

    case ActionTypes.FETCH_TRIBE_MEMBERS_LIST_FAILURE:
      return { ...state }

    case ActionTypes.ADD_USER_TO_TRIBE:
      const tribeMemberDetail = state.teamMembers.filter(member => member.userId === action.payload.userId)
      console.log(tribeMemberDetail)
      return {
        ...state,
        tribeMembers: [...state.tribeMembers, action.payload],
        tribeMembersDetails: [...state.tribeMembersDetails, tribeMemberDetail[0]],
        teamMembers: state.teamMembers.filter(member => member.userId != action.payload.userId)
      }

    case ActionTypes.TOGGLE_USER_REACHOUT_PERMISSION: {
      return {
        ...state,
        tribeMembers: state.tribeMembers.map(member =>
          member.userId === action.payload.userId ?
            {
              ...member,
              permissions: member.permissions.includes(2) ? member.permissions.filter(i => i !== 2) : [...member.permissions, 2]
            }
            :
            member
        )
      }
    }

    case ActionTypes.TOGGLE_USER_ACTIVITY_PERMISSION: {

      return {
        ...state,
        tribeMembers: state.tribeMembers.map(member =>
          member.userId === action.payload.userId ?
            {
              ...member,
              permissions: member.permissions.includes(3) ? member.permissions.filter(i => i !== 3) : [...member.permissions, 3]
            }
            :
            member
        )
      }
    }

    case ActionTypes.REMOVE_TRIBE_MEMBER: {
      console.log("|||||||||||||||||||||||||||")
      console.log(action.payload.userId)

      const teamMember = state.tribeMembersDetails.filter((member, i) => member.userId === action.payload.userId)
      console.log(teamMember)
      // console.log("========================================01010101")
      // console.log("-------members")
      // console.log(state.tribeMembers)
      // console.log("------instate team members")
      // console.log([...state.teamMembers, teamMember[0]])
      // console.log("------after filtering members")
      // console.log(state.tribeMembersDetails.filter((member, i) => member.id !== action.payload.userId))
      return {
        ...state,
        teamMembers: [...state.teamMembers, teamMember[0]],
        tribeMembers: state.tribeMembers.filter(member => member.userId !== action.payload.userId),
        tribeMembersDetails: state.tribeMembersDetails.filter((member, i) => member.userId !== action.payload.userId)
      }
    }

    case ActionTypes.SKIP_ASSIGN_TRIBE_STEP:
    case ActionTypes.CLEAR_TRIBE_STATE:
      {
        return {
          ...state,
          tribeMembers: [],
          teamMembers: [],
          tribeMembersDetails: []
        }
      }

    case ActionTypes.ADD_TRIBE: {
      return {
        ...state,
        isAdding: true
      }
    }
    case ActionTypes.ADD_TRIBE_SUCCESS: {
      return {
        ...state,
        isAdding: false
      }
    }
    case ActionTypes.EDIT_TRIBE: {
      return {
        ...state,
        isEditing: true
      }
    }
    case ActionTypes.EDIT_TRIBE_SUCCESS: {
      return {
        ...state,
        isEditing: false
      }
    }
    default:
      return state
  }

}

export default selected