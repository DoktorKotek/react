import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import './styles.css';
import { ThemeContext } from './index'

// export default function Button({ value, onClick }) {
//   return (
//     <ThemeContext.Consumer>
//       {theme => <input
//         className={`button ${theme.backgroundColor ||
//         ''} ${theme.foregroundColor || ''}`}
//         type="button"
//         value={value}
//         onClick={onClick}
//       />}
//     </ThemeContext.Consumer>
//   );
// }

export default function Button({ value, onClick, theme }) {
  return (
    <input
      className={`button ${theme.backgroundColor ||
      ''} ${theme.foregroundColor || ''}`}
      type="button"
      value={value}
      onClick={onClick}
    />
  );
}

Button.propTypes = {
  value: PropTypes.string.isRequired,
  theme: PropTypes.object,
  onClick: PropTypes.func
};
