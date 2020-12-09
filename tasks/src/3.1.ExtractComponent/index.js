import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import './styles.css';

/**
    1. Переделай renderPost в функциональный компонент Post
   
    2. ESLint настроен так, чтобы проверять переданные атрибуты. Поэтому задай propTypes.
       У нас везде атрибуты — это строки. Сделай свойства author и time обязательными.
   
    3. Сделай так, чтобы в author подставлялось значение <Неизвестный автор>,
       если атрибут не передали.
       Используй для этого defaultProps.
       Проверь что работает, убрав имя автора.
   
    4. Переделай компонент так, чтобы message передавался через props.children.
 */

// Эта строка нужна, чтобы ESLint не сильно ругался, пока не написаны PropTypes.
/*eslint react/prop-types: "warn" */

function Post(props) {
  return (
    <div className="post">
      <div className="postHeader">
        <span className="postAuthor">{props.author}</span>
        <br />
        <span className="postTime">{props.time}</span>
      </div>
      <div className="postMessage">{props.children}</div>
    </div>
  );
}
Post.propTypes = {
  author: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  message: PropTypes.string,
  children: PropTypes.string,
}
Post.defaultProps = {
  author: 'Неизвестный автор',
}

ReactDom.render(
  <div className="page">
    <div className="posts">
      <Post
        author="Милая девушка"
        time="3 часа назад"
      >
        Можно использовать для выпекания чизкейков :)
      </Post>
    </div>
  </div>,
  document.getElementById('app')
);

/**
    Подсказки к 1:
    - {renderMyComponent({a: 1, b: 'some'})} → <MyComponent a={1} b="some">
    - Первый аргумент функции компонента обычно называется props
   
    Подсказки к 2:
    - В начале файла нужно импортировать PropTypes
    - MyComponent.propTypes = {
        a: PropTypes.number.isRequired,
        b: PropTypes.string,
        onFire: PropTypes.func
      }
   
    Подсказки к 3:
    - MyComponent.defaultProps = {
        b: 'default value'
      }
   
    Подсказки к 4:
    - Дети — это вложенные узлы тэга.
      Пример с одним ребенком: <MyComponent>Значение</MyComponent>
    - Дети попадают в props в виде массива props.children.
    - При использовании надо добавлять в propTypes компонента: 
          children: PropTypes.node
 */
