
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import classes from './OrderIcon.module.css'; // Import CSS module

const OrderIcon = ({ onClickButton }) => {
  return (
    <div className={classes.icon} onClick={onClickButton}>
      <FontAwesomeIcon icon={faShoppingBag} color="white" />
    </div>
  
  );
};

export default OrderIcon;


