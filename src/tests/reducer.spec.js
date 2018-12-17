import reducer, { initialState } from '../reducers/map';
import * as cnst from '../actions/constants';

describe('Map reducers', () => {
  it('REQUESTED_GEOPOINT', () => {
    const action = {
      type: cnst.REQUESTED_GEOPOINT
    };

    expect(reducer(initialState, action)).toEqual({
      ...initialState
    });
  });

  it('REQUESTED_GEOPOINT_SUCCESS', () => {
    const action = {
      type: cnst.REQUESTED_GEOPOINT_SUCCESS,
      payload: {
        id: 123123123,
        request: 'some string',
        target: 'one more string',
        pos: [123, 123]
      }
    };

    expect(reducer(initialState, action)).toEqual({
      points: [
        ...initialState.points,
        {
          id: action.payload.id,
          request: action.payload.request,
          target: action.payload.target,
          pos: action.payload.pos
        }
      ]
    });
  });

  it('REQUESTED_GEOPOINT_FAILURE', () => {
    const action = {
      type: cnst.REQUESTED_GEOPOINT_FAILURE
    };

    expect(reducer(initialState, action)).toEqual({
      ...initialState
    });
  });
});
