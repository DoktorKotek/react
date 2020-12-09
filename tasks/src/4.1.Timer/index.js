import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import './styles.css';

/**
    1. Допиши TimeDisplay так, чтобы он показывал текущее время пользователя и сам обновляется каждую секунду.
    2. Пусть при каждом обновлении времени в консоль пишется сообщение:
          console.log('tick');
    3. Позаботься об освобождении ресурсов в случае удаления элемента.
       Убедись, что если компонент скрыть кнопкой, то в консоль не будут писаться тики.
 */

class Timer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      timeVisible: true,
      localTime: new Date(),
    };
    this.intervalId = null
  }
  
  startTimer() {
    this.intervalId = setInterval(() => {
      console.log('tick')
      this.setState({
        localTime: new Date(),
      })
    }, 1000)
  }
  
  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
  
  componentDidMount() {
    this.startTimer()
  }
  componentWillUnmount() {
    this.stopTimer()
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.timeVisible === prevState.timeVisible) {
      return
    }
    if (this.state.timeVisible) {
      this.startTimer()
    } else {
      this.stopTimer()
    }
  }
  
  render() {
    const { timeVisible } = this.state;
    return (
      <div className="page">
        <input
          className="button"
          type="button"
          value={timeVisible ? 'Скрыть' : 'Показать'}
          onClick={() => {
            this.setState({ timeVisible: !timeVisible });
          }}
        />
        {this.state.timeVisible && <TimeDisplay localTime={this.state.localTime} />}
      </div>
    );
  }
}

class TimeDisplay extends React.Component {
  render() {
    return (
      <div className="time">{this.props.localTime.toLocaleTimeString()}</div>
    );
  }
}

TimeDisplay.propTypes = {
  localTime: PropTypes.object.isRequired,
}

ReactDom.render(<Timer />, document.getElementById('app'));

/**
    Подсказки:
    - Функция setInterval регистрирует обработчик handler,
      который будет вызываться не чаще, чем в заданное количество миллисекунд.
      Оформляется так:
          const intervalId = setInterval(handler, intervalInMilliseconds);
    - intervalId можно передать в функцию clearInterval, чтобы остановить вызов обработчика:
          clearInterval(intervalId);
    - this.setState({property: value}) обновляет часть состояния и инициирует перерисовку.
    - componentDidMount вызывается сразу после того, как компонент размещен на странице.
      В нем можно делать запросы на получение данных или подписываться на события.
    - componentWillUnmount вызывается перед тем как удалить компонент.
      Гарантированно вызовется, если элемент «did mount». Отличное место, чтобы освобождать ресурсы.
 */
