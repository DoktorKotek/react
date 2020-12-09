import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import './styles.css';
import * as helpers from './helpers';
import * as themes from './themes';
import Button from './Button';
import TimeDisplay from './TimeDisplay';
import Timer from './Timer';

/**
    Автор кода явно сделал много лишней работы,
    прокидывая информацию о времени и настройках цвета через все компоненты.
    А все потому, что не знал про context!

    Для начала разведка ситуации:
    1. Открой Developer Tools и убедись, что render в Card вызывается по 5 раз каждую секунду.
    2. Убедись, что render в Card вызывается при использовании кнопок смены цвета.
    3. Почему render в Top вызывается каждую секунду, если Top — это PureComponent у которого в props нет currentTime?
    4. Подумай, что нужно сделать, чтобы перенести карточку Нью-Йорка в блок Top, а кнопки смены цвета в блок Bottom.
    
    Отрефактори код по шагам:
    1. Создай CurrentTimeContext.
    2. В компоненте ColorsOfTime в методе render оберни <div className="page">...</div> в CurrentTimeContext.Provider,
       чтобы предоставить максимально большой доступ к value провайдера. В качестве value в тэге Provider задай currentTime.
    3. Используй CurrentTimeContext.Consumer, чтобы не прокидывать currentTime через свойства.
       Тут стратегия минимизации: надо оборачивать в Consumer только те компоненты, которым ресурс требуется.
       Потому что при обновлении значения контекста будет перерисовываться все, что внутри Consumer'ов.
    4. Не забудь убрать ненужное теперь простаскивание currentTime через параметры!
    5. Открой Developer Tools и посмотри, как часто вызывается render в Card с течением времени.
       Попробуй объяснить, почему использование context привело к такому эффекту.
    6. Проделай то же самое для ThemeContext:
       - Создай ThemeContext
       - Оберни CurrentTimeContext.Provider в ThemeContext.Provider
       - Используй ThemeContext.Consumer для передачи темы в кнопки и в Card с цветным локальным временем
       - Снова приберись в коде!
    7. Добавь ChangeThemeContext. Пусть он хранит ссылку на функцию dispatchChangeTheme.
       Пусть кнопки смены цвета теперь создают обработчики на основе ChangeThemeContext,
       а не получают их через onPrevTheme и onNextTheme.
       Приберись в коде.
    8. Открой Developer Tools, и убедись, перестал происходить render в Top. Объясни, почему так.
    9. Перенеси Лондон в блок Top, за ним в блок Top перенеси Нью-Йорк, Париж и Пекин.
       А кнопки смены цвета перенеси в блок Bottom.
       Удобно ли было переносить эти компоненты сейчас?
   10. Если контекст используется часто, можно создать специальный HOC компонент, чтобы оборачивать компоненты в Consumer.
       Найди в themes.js Context и используй в качесте ThemeContext:
          const ThemeContext = themes.Context;
       Теперь ты можешь определить кнопку так:
          const ThemedButton = themes.withTheme(Button);
       Используй ее!
 */


const CurrentTimeContext = React.createContext(null)
export const ThemeContext = themes.Context//React.createContext(themes.red)

class ColorsOfTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: null,
      theme: themes.red
    };
  }

  componentDidMount() {
    this.props.timer.addUpdated(this.handleTimerUpdated);
  }

  componentWillUnmount() {
    this.props.timer.removeUpdated(this.handleTimerUpdated);
  }

  changeTimePrev = () => this.dispatchChangeTheme('prev')
  changeTimeNext = () => this.dispatchChangeTheme('next')
  
  render() {
    const { currentTime, theme } = this.state;
    return (
      <ThemeContext.Provider value={theme}>
        <CurrentTimeContext.Provider value={currentTime}>
          <div className="page">
            <h1>Цвета времени</h1>
            <Top
              onPrevTheme={this.changeTimePrev}
              onNextTheme={this.changeTimeNext}
            />
            <Middle />
            <Bottom />
          </div>
        </CurrentTimeContext.Provider>
      </ThemeContext.Provider>
      
    );
  }

  handleTimerUpdated = currentTime => {
    this.setState({ currentTime: currentTime });
  };

  dispatchChangeTheme = type => {
    let newTheme = null;
    switch (type) {
      case 'prev':
        newTheme = themes.getPrevTheme(this.state.theme);
        break;
      case 'next':
        newTheme = themes.getNextTheme(this.state.theme);
        break;
    }
    this.setState({ theme: newTheme });
  };
}

ColorsOfTime.propTypes = {
  timer: PropTypes.object
};

const ThemedButton = themes.withTheme(Button)

class Top extends React.PureComponent {
  render() {
    registerRenderForDebug('Top');
    const { onPrevTheme, onNextTheme } = this.props;
    return (
      <div className="block">
        <ThemedButton value="← цвет" onClick={onPrevTheme} />
        <ThemedButton value="цвет →" onClick={onNextTheme} />
        <Card title="Серый Лондон" timezone={+0} />
        <Card
          title="Синий Нью-Йорк"
          timezone={-4}
          color="blue"
        />
        <Card
          title="Зеленый Париж"
          timezone={+2}
          color="green"
        />
        <Card
          title="Красный Пекин"
          timezone={+8}
          color="red"
        />
      </div>
    );
  }
}

Top.propTypes = {
  onPrevTheme: PropTypes.func,
  onNextTheme: PropTypes.func
};

class Middle extends React.PureComponent {
  render() {
    return (
      <div className="block">
        <Card title="Цветное локальное" />
        {/*<Card title="Серый Лондон" timezone={+0} />*/}
      </div>
    );
  }
}

Middle.propTypes = {
  theme: PropTypes.object,
  currentTime: PropTypes.object
};

class Bottom extends React.PureComponent {
  render() {
    return (
      <div className="block">
        {/*<Card*/}
        {/*  title="Синий Нью-Йорк"*/}
        {/*  timezone={-4}*/}
        {/*  color="blue"*/}
        {/*/>*/}
        {/*<Card*/}
        {/*  title="Зеленый Париж"*/}
        {/*  timezone={+2}*/}
        {/*  color="green"*/}
        {/*/>*/}
        {/*<Card*/}
        {/*  title="Красный Пекин"*/}
        {/*  timezone={+8}*/}
        {/*  color="red"*/}
        {/*/>*/}
      </div>
    );
  }
}

Bottom.propTypes = {
  currentTime: PropTypes.object
};

class Card extends React.PureComponent {
  render() {
    registerRenderForDebug('Card');
    const { title, timezone, color } = this.props;
    return (
      <div className="card">
        <h3>{title}</h3>
        <div>
          <ThemeContext.Consumer>
            {theme => <CurrentTimeContext.Consumer>
              {currentTime => <TimeDisplay
                time={
                  timezone ? helpers.toTimezone(currentTime, timezone) : currentTime
                }
                color={color || theme.foregroundColor}
              />}
            </CurrentTimeContext.Consumer>}
          </ThemeContext.Consumer>
         
          
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  timezone: PropTypes.number,
  currentTime: PropTypes.object
};

function registerRenderForDebug(name) {
  console.log(`render ${name} at ${new Date().toLocaleTimeString()}`);
}

const timer = new Timer();
ReactDom.render(<ColorsOfTime timer={timer} />, document.getElementById('app'));

/**
    Подсказки:
    - Создание контекста:
      const CakeContext = React.createContext();
    - Поставка значения:
      <CakeContext.Provider value={cheeseCake}>
        ...
      </CakeContext.Provider>
    - Потребление значения:
      <CakeContext.Consumer>
        {cake => <Hungry food={cake} />}
      </CakeContext.Consumer>
 */
