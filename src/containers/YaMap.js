import React, { Component } from 'react';
import { YMaps, Map, Placemark, Polyline, ZoomControl } from 'react-yandex-maps';

const mapState = {
  center: [55.754183, 37.619523],
  zoom: 10,
  behaviors: 'drag'
};

class DisplayMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: mapState.center
    };
  }

  onBoundsChange(event) {
    this.props.setMapCenter(event.get('newCenter'));
    this.setState({
      center: event.get('newCenter')
    });
  }

  onChangePos(e, i) {
    const pos = e.originalEvent.target.geometry._coordinates;
    this.props.changePosition(pos, i);
  }

  render() {
    const { points } = this.props;
    return (
      <div>
        <YMaps>
          <Map defaultState={mapState} width={450} height={256} onBoundsChange={event => this.onBoundsChange(event)}>
            <ZoomControl
              options={{
                size: 'small',
                zoomDuration: 600,
                position: {
                  right: 10,
                  top: 100
                }
              }}
            />
            {points.map((point, i) => (
              <Placemark
                key={point.id}
                geometry={[parseFloat(point.pos[0]), parseFloat(point.pos[1])]}
                properties={{ balloonContent: `${point.request} (Полный адрес: ${point.target})`, iconContent: i + 1 }}
                modules={['geoObject.addon.balloon']}
                options={{ draggable: true }}
                onDragEnd={e => this.onChangePos(e, i)}
              />
            ))}
            <Polyline
              geometry={points.map(point => [parseFloat(point.pos[0]), parseFloat(point.pos[1])])}
              options={{
                strokeColor: '#000000',
                strokeWidth: 4,
                strokeOpacity: 0.7
              }}
            />
          </Map>
        </YMaps>
      </div>
    );
  }
}

export default DisplayMap;
