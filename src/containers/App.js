import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Form from './Form';
import YaMap from './YaMap';
import PointsList from './PointsList';

import * as mapActions from '../actions/MapActions';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMapCenter: [55.754183, 37.619523]
    };
    this.getMapCenter = this.getMapCenter.bind(this);
  }

  getMapCenter(center) {
    this.setState({
      currentMapCenter: center
    });
  }

  changeListPosition(drag, hover) {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const newArr = arr.filter((value, index, array) => drag !== index);
    newArr.splice(hover, 0, arr[drag]);
  }

  render() {
    const { geopoints, appActions, changePos } = this.props;
    const { currentMapCenter } = this.state;
    const { points } = geopoints;

    const { fetchGeopoint, deleteGeopoint, sortGeopoints, requestChangedPosition } = appActions;

    return (
      <div className="container">
        <div className="aside">
          <Form searchPoint={fetchGeopoint} currentMapCenter={currentMapCenter} />
          <PointsList points={points} deleteGeopoint={deleteGeopoint} changePos={this.changeListPosition} sortGeopoints={sortGeopoints} />
        </div>
        <div id="map">
          <YaMap points={points} changePosition={requestChangedPosition} setMapCenter={this.getMapCenter} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    geopoints: state.mapReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(mapActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
