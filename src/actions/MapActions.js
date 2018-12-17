import fetch from 'isomorphic-fetch';
import 'cross-fetch/polyfill';
import { REQUESTED_GEOPOINT, REQUESTED_GEOPOINT_SUCCESS, REQUESTED_GEOPOINT_FAILURE, DELETE_GEOPOINT, SORT_GEOPOINTS, CHANGE_POSITION } from './constants';

export const requestGeopoint = () => ({
  type: REQUESTED_GEOPOINT
});

export const requestGeopointSuccess = (data, inputValue) => {
  return {
    type: REQUESTED_GEOPOINT_SUCCESS,
    payload: {
      id: new Date().getTime(),
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
  };
};

export const requestGeopointError = () => ({
  type: REQUESTED_GEOPOINT_FAILURE
});
export function fetchGeopoint(inputValue, currentMapCenter) {
  return dispatch => {
    dispatch(requestGeopoint());
    return fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${currentMapCenter}`)
      .then(res => res.json())
      .then(data => dispatch(requestGeopointSuccess(data, inputValue)));
  };
}
export const deleteGeopoint = id => ({
  type: DELETE_GEOPOINT,
  payload: id
});
export const sortGeopoints = (drag, drop) => ({
  type: SORT_GEOPOINTS,
  payload: [drag, drop]
});

export const changePosition = (data, pos, i) => ({
  type: CHANGE_POSITION,
  payload: { data, pos, i }
});

export function requestChangedPosition(pos, i) {
  return dispatch => {
    dispatch(requestGeopoint());
    return fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${pos[1]},${pos[0]}`)
      .then(res => res.json())
      .then(data => {
        const text = data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
        return dispatch(changePosition(text, pos, i));
      });
  };
}
