import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { inputValue } = this.state;
    const { searchPoint } = this.props;
    const { currentMapCenter } = this.props;
    if (inputValue) {
      searchPoint(inputValue, [currentMapCenter[1], currentMapCenter[0]]);
    }
    this.setState({ inputValue: '' });
  }

  render() {
    const { inputValue } = this.state;
    return (
      <form className="search" onSubmit={this.handleSubmit}>
        <input value={inputValue} className="search__field" type="text" placeholder="Новая точка маршрута" onChange={this.handleInputChange} />
        <button className="search__button" type="submit">
          <i className="search__button__icon fas fa-search" />
        </button>
      </form>
    );
  }
}

export default Form;
