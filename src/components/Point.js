import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/fp/flow';

const itemDragSpec = {
  beginDrag(props) {
    return {
      id: props.item.id,
      index: props.index
    };
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
    return monitor.getDropResult(props.item.id);
  }
};

const itemDropSpec = {
  drop(props, monitor, component) {
    return monitor.getItem();
  },
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.changePos(dragIndex, hoverIndex);
    props.sortGeopoints(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  }
};

const itemDragCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

const itemDropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  dropItem: monitor.getItem()
});

class Point extends Component {
  render() {
    const { item, deleteGeopoint, index } = this.props;
    const { connectDragSource, isDragging, dragItem } = this.props;
    const { connectDropTarget, isOver } = this.props;
    const opacity = isDragging ? 0 : 1;
    const bgColor = isOver ? 'lightgreen' : 'white';

    return connectDragSource(
      connectDropTarget(
        <div
          key={item.id}
          ref={node => {
            this.node = node;
          }}
          className="way-point"
          style={{ opacity, background: bgColor }}>
          <span className="way-point__info">{`[${index + 1}] ${item.request}`}</span>
          <button onClick={() => deleteGeopoint(item.id)} className="way-point__button" type="submit">
            <i className="fas fa-times way-point__button__icon" />
          </button>
        </div>
      )
    );
  }
}

export default flow(
  DragSource('item', itemDragSpec, itemDragCollect),
  DropTarget('item', itemDropSpec, itemDropCollect)
)(Point);
