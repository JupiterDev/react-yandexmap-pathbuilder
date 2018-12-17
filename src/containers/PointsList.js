import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Point from '../components/Point';

class PointsList extends Component {
  deleteGeopoint(id) {
    const { deleteGeopoint } = this.props;
    deleteGeopoint(id);
  }

  sortGeopoints(id) {
    const { sortGeopoints } = this.props;
    sortGeopoints(id);
  }

  render() {
    const { points, deleteGeopoint, sortGeopoints, changePos } = this.props;
    return (
      <div className="way-block">
        {points.map((item, index) => (
          <Point
            key={item.id}
            item={item}
            index={index}
            deleteGeopoint={deleteGeopoint}
            sortGeopoints={sortGeopoints}
            changePos={(drag, hover) => changePos(drag, hover)}
          />
        ))}
      </div>
    );
  }
}

PointsList.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      request: PropTypes.string.isRequired,
      target: PropTypes.string.isRequired,
      pos: PropTypes.array.isRequired
    })
  ).isRequired
};

export default DragDropContext(HTML5Backend)(PointsList);
