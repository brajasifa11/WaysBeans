import React from "react";
import classes from './index.module.scss';
import { convertRupiah } from "../../utils/RupiahFormat";

export const Display = ({ show, setShow, setNameModal, products }) => {

  const card = () => {
    setShow(!show);
    setNameModal('login');
  };

  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        {products &&
          products?.map((item, idx) => {
            return (
              <div className={classes.card} key={idx} onClick={card}>
                <img src={item.photo} alt={item.name} />
                <div className={classes.description}>
                  <div className={classes.title}>
                    <strong>
                      <p>{item.name}</p>
                    </strong>
                  </div>
                  <div className={classes.subtitle}>
                    <p className={classes.price}>
                      {convertRupiah(item.price)}
                    </p>
                    <p className={classes.stock}>
                      Stock : {item.stock}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
