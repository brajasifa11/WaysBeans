import React, { useEffect, useState } from "react";
import classes from './index.module.scss';

import profpic from '../../../static/images/profpic.png';
import Logo from '../../../static/icons/Logo.png';
import Barcode from '../../../static/icons/Barcode.png';
import waiting from '../../../static/icons/waiting.png';
import completed from '../../../static/icons/completed.png';
import otw from '../../../static/icons/otw.png';
import success from '../../../static/icons/success.png';
import { API } from "../../../config/api";
import { convertRupiah } from "../../../utils/RupiahFormat";

const Profile = () => {
  const [transaction, setTransaction] = useState([]);

  const getMyTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
      };
      const response = await API.get('/my-transaction', config);
      setTransaction(response.data.data.transaction)
    } catch (error) {
      console.log(error)
    };
  };

  useEffect(() => {
    getMyTransactions();
  }, [])

  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        <div className={classes.content}>
          <div className={classes.title}>
            <p className={classes.sectionProfile}>My Profile</p>
            <p className={classes.senctionhistory}>My Transaction</p>
          </div>
          <div className={classes.body}>
            <div className={classes.leftSection}>
              <div className={classes.profile}>
                <div className={classes.avatar}>
                  <img src={profpic} alt='avatar' />
                </div>
                <div className={classes.infoWraper}>
                  {transaction &&
                    transaction.map((item, idx) => {
                      return (
                        <div className={classes.nameWraper} key={idx}>
                          <p className={classes.fullname}>Full Name</p>
                          <p className={classes.name}>{item.name}</p>
                        </div>
                      )
                    })
                  }
                  {transaction &&
                    transaction.map((item, idx) => {
                      return (
                        <div className={classes.emailWraper} key={idx}>
                          <p className={classes.email}>Email</p>
                          <p className={classes.myemail}>{item.email}</p>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>

            <div className={classes.rightSection}>
              {transaction &&
                transaction.map((item, idx) => {
                  return (item.TransactionOrder.map((product, idx) => {
                    return (
                      <div className={classes.historyContainer} key={idx}>
                        <div className={classes.history}>
                          <img src={product?.ProductOrder?.photo} />
                          <div className={classes.detailed}>
                            <p className={classes.productName}>{product?.ProductOrder?.name}</p>
                            <p className={classes.date}>{item.date}</p>
                            <p className={classes.subdetailed}>Price : {convertRupiah(product?.ProductOrder?.price)}</p>
                            <p className={classes.subdetailed}>Qty : {product.qty}</p>
                            <p className={classes.subtotal}>Sub Total : {convertRupiah(product?.ProductOrder?.price * product.qty)}</p>
                          </div>
                        </div>
                        <div className={classes.statusWraper}>
                          <img className={classes.logo} src={Logo} alt='icon' />
                          <img className={classes.barcode} src={Barcode} alt='barcode' />
                          {transaction.status !== 'Success' &&
                            <img className={classes.status}
                              src={item.status === 'Waiting Approve' ?
                                waiting : item.status === 'On The Way' ?
                                  success : completed} />
                          }
                        </div>
                      </div>
                    )
                  }))
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;