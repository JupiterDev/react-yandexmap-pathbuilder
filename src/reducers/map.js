import {
  REQUESTED_GEOPOINT,
  REQUESTED_GEOPOINT_SUCCESS,
  REQUESTED_GEOPOINT_FAILURE,
  DELETE_GEOPOINT,
  SORT_GEOPOINTS,
  CHANGE_POSITION
} from '../actions/constants';

export const initialState = {
  points: [
    {
      id: 0,
      request: 'ШТАБ-КВАРТИРА FUNBOX',
      target: 'Москва, улица Большая Ордынка, 54с2',
      pos: ['55.734111', '37.623914']
    }
  ]
};

export default function mapReducer(state = initialState, action) {
  switch (action.type) {
    case REQUESTED_GEOPOINT:
      return state;
    case REQUESTED_GEOPOINT_SUCCESS:
      return {
        points: [
          ...state.points,
          {
            id: action.payload.id,
            request: action.payload.request,
            target: action.payload.target,
            pos: action.payload.pos
          }
        ]
      };
    case REQUESTED_GEOPOINT_FAILURE:
      return state;
    case DELETE_GEOPOINT:
      return {
        points: state.points.filter(item => item.id !== action.payload)
      };
    case SORT_GEOPOINTS: {
      const newArr = state.points.filter((value, index) => action.payload[0] !== index);
      newArr.splice(action.payload[1], 0, state.points[action.payload[0]]);
      return {
        points: newArr
      };
    }
    case CHANGE_POSITION: {
      const changedPoints = state.points.map((point, index) => {
        if (action.payload.i === index) {
          point.pos = action.payload.pos;
          point.target = action.payload.data;
          return point;
        }
        return point;
      });
      return {
        points: changedPoints
      };
    }
    default:
      return state;
  }
}
