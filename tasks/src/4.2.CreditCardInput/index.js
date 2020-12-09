import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import 'regenerator-runtime';
import './styles.css';
import Api from './Api';
import CreditCardNumber from './CreditCardNumber';

/**
    CreditCardInput не просто показывает переданное value,
    а использует внутреннее состояние для форматирования ввода пользователя.
    CreditCardInputWithRestore должен обеспечить восстановление номера кредитной карты с сервера,
    но не работает из-за ошибки в CreditCardInput.

    Исправь ошибку в CreditCardInput.
    Если сервер ответит до того как пользователь успел что-то поредактировать,
    значение в поле ввода должно быть перетерто полученным из api значением
    (наш «сервер» всегда отвечает 1234 5678 9012 3456).
    Иначе значение с сервера нужно проигнорировать.
 */

const INITIAL_STATE = {
  value: '0000 0000 0000 0000',
}

class CreditCardInputWithRestore extends React.Component {
  constructor() {
    super();
    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    this.restoreFromApi();
  }

  render() {
    return (
      <CreditCardInput
        value={this.state.value}
        onChange={value => this.setState({ value })}
      />
    );
  }

  async restoreFromApi() {
    const value = await Api.getValue();
    this.setState(prevState => {
      if (prevState.value === INITIAL_STATE.value) {
        return { value }
      }
      return {
        ...prevState
      }
    });
  }
}

class CreditCardInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value
      })
    }
  }
  
  render() {
    console.log('state', this.state.value)
    return (
      <div className="root">
        <div className="form">
          <input
            type="text"
            pattern="9999 9999 9999 9999"
            value={this.state.value || ''}
            width={120}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          />
        </div>
      </div>
    );
  }

  handleFocus = () => {
    this.setState({ value: '' });
  };

  handleChange = event => {
    const formattedValue = CreditCardNumber.format(event.target.value);
    this.setState({ value: formattedValue });
  };

  handleBlur = () => {
    if (CreditCardNumber.isValid(this.state.value)) {
      this.props.onChange(this.state.value);
    }
  };
}

CreditCardInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

ReactDom.render(<CreditCardInputWithRestore />, document.getElementById('app'));

/**
    Подсказки:
    - static getDerivedStateFromProps(nextProps, prevState) вызывается сразу после вызова конструктора,
      а также при получении компонентом измененных props. Он тебе поможет. Из него нужно вернуть новый state,
      полученный умным объединением старого состояния и новых свойств.
    - Даже при задании getDerivedStateFromProps состояние должно инициализироваться в конструкторе.
 */
