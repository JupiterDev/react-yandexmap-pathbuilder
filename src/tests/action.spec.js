import 'isomorphic-fetch';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import expect from 'expect';

import {
  requestGeopoint,
  requestGeopointSuccess,
  requestGeopointError,
  fetchGeopoint,
  deleteGeopoint,
  sortGeopoints,
  changePosition,
  requestChangedPosition
} from '../actions/MapActions';
import * as cnst from '../actions/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Map sync actions', () => {
  it('requestGeopoint', () => {
    expect(requestGeopoint()).toEqual({
      type: cnst.REQUESTED_GEOPOINT
    });
  });

  it('requestGeopointSuccess', () => {
    const data = {
      response: {
        GeoObjectCollection: {
          featureMember: [
            {
              GeoObject: {
                metaDataProperty: {
                  GeocoderMetaData: {
                    text: 'Россия, Москва, Неглинная улица, 10'
                  }
                },
                Point: {
                  pos: '37.620411 55.76214'
                }
              }
            }
          ]
        }
      }
    };
    const inputValue = 'qwerty';
    expect(requestGeopointSuccess(data, inputValue)).toEqual({
      type: cnst.REQUESTED_GEOPOINT_SUCCESS,
      payload: {
        id: String(new Date().getTime()).slice(0, -3),
        request: inputValue,
        target: data.response.GeoObjectCollection.featureMember[0]
          ? data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text
          : 'Кремль',
        pos: data.response.GeoObjectCollection.featureMember[0]
          ? [
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(Number)[1],
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(Number)[0]
            ]
          : [55.751173, 37.622423]
      }
    });
  });

  it('requestGeopointError', () => {
    expect(requestGeopointError()).toEqual({
      type: cnst.REQUESTED_GEOPOINT_FAILURE
    });
  });

  it('deleteGeopoint', () => {
    const id = 3;
    expect(deleteGeopoint(id)).toEqual({
      type: cnst.DELETE_GEOPOINT,
      payload: 3
    });
  });

  it('sortGeopoints', () => {
    const drag = 1;
    const drop = 3;
    expect(sortGeopoints(drag, drop)).toEqual({
      type: cnst.SORT_GEOPOINTS,
      payload: [1, 3]
    });
  });

  it('changePosition', () => {
    const data = 'qwerty';
    const pos = [51, 39];
    const i = 2;
    expect(changePosition(data, pos, i)).toEqual({
      type: cnst.CHANGE_POSITION,
      payload: { data: 'qwerty', pos: [51, 39], i: 2 }
    });
  });
});

describe('Map async actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const fetchData = {
    response: {
      GeoObjectCollection: {
        featureMember: [
          {
            GeoObject: {
              metaDataProperty: {
                GeocoderMetaData: {
                  text: 'Россия, Москва, Неглинная улица, 10'
                }
              },
              Point: {
                pos: '37.620411 55.76214'
              }
            }
          }
        ]
      }
    }
  };

  it('fetchGeopoint', () => {
    fetchMock.getOnce(`https://geocode-maps.yandex.ru/1.x/?format=json&geocode=37.620411, 55.76214`, fetchData);
    const expectedActions = [requestGeopoint(), requestGeopointSuccess(fetchData, '123')];
    const store = mockStore({});
    return store.dispatch(fetchGeopoint('123', [37.620411, 55.76214])).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('requestChangedPosition', () => {
    fetchMock.getOnce(`https://geocode-maps.yandex.ru/1.x/?format=json&geocode=37.620411, 55.76214`, fetchData);
    const text = fetchData.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
    const expectedActions = [requestGeopoint(), changePosition(text, [55.76214, 37.620411], 2)];
    const store = mockStore({});
    return store.dispatch(requestChangedPosition([55.76214, 37.620411], 2)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
