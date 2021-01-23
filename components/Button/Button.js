import styled, { css } from 'styled-components';
import React from 'react';


const Clicker = styled.button`
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 700;
  border: 0;
  border-radius: 3em;
  cursor: pointer;
  display: inline-block;
  line-height: 1;
  margin-left: 5px;
  background: ${props => props.primary ? "#1ea7fd" : "transparent"};
  box-shadow: ${props => props.primary ? "none" : "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset"};
  color: ${props => props.primary ? "white" : "#333"};

  ${({ size }) =>
        size == 'large' &&
        css`
          font-size: 16px;
          padding: 12px 24px;
        `}

  ${({ size }) =>
        size == 'medium' &&
        css`
          font-size: 14px;
          padding: 11px 20px;
        `}

  ${({ size }) =>
        size == 'small' &&
        css`
          font-size: 12px;
          padding: 10px 16px;
        `}
`;



/**
 * Primary UI component for user interaction
 */
const Button = ({ primary, backgroundColor, size, label, ...props }) => {
  // const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <Clicker
      size={size}
      primary={primary}
      type="button"
      // className={['button', `button--${size}`, mode].join(' ')}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}
    </Clicker>
  );
};

// Button.propTypes = {
//   /**
//    * Is this the principal call to action on the page?
//    */
//   primary: PropTypes.bool,
//   /**
//    * What background color to use
//    */
//   backgroundColor: PropTypes.string,
//   /**
//    * How large should the button be?
//    */
//   size: PropTypes.oneOf(['small', 'medium', 'large']),
//   /**
//    * Button contents
//    */
//   label: PropTypes.string.isRequired,
//   /**
//    * Optional click handler
//    */
//   onClick: PropTypes.func,
// };
//
// Button.defaultProps = {
//   backgroundColor: null,
//   primary: false,
//   size: 'medium',
//   onClick: undefined,
// };

export default Button
