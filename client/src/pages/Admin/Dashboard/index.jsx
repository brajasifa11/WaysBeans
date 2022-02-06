import React, { useEffect, useState } from "react";
import classes from './index.module.scss';
import Succsess from '../../../static/icons/Succsess.png';
import Cancel from '../../../static/icons/Cancel.png';
import { API } from "../../../config/api";

const Title = [
  {
    id: 1,
    Title: 'No',
  },
  {
    id: 2,
    Title: 'Name',
  },
  {
    id: 3,
    Title: 'Address',
  },
  {
    id: 4,
    Title: 'Products Order',
  },
  {
    id: 5,
    Title: 'Status',
  },
  {
    id: 6,
    Title: 'Action',
  },
]

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const getTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      };

      const response = await API.get('/transactions', config);
      setTransactions(response.data.data.transaction);
    } catch (error) {
      console.log(error)
    };
  };
  const handleUpdate = async (status, id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      };

      const body = JSON.stringify({
        status: status,
      })
      const response = await API.patch(`/transaction/edit/${id}`, body, config);
      getTransactions();
    } catch (error) {
      console.log(error)
    };
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        <p className={classes.title}>Income Transaction</p>
        <div className={classes.content}>
          <table className={classes.table}>
            <thead className={classes.tablee}>
              <tr className={classes.headTable}>
                {Title &&
                  Title.map((item, idx) => {
                    return (
                      <th key={idx}>
                        {item.Title}
                      </th>
                    )
                  })
                }
              </tr>
            </thead>
            {transactions &&
              transactions.map((item, idx) => {
                return (
                  <tbody className={classes.bodyTable} key={idx}>
                    <tr>
                      <td>
                        {idx + 1}
                      </td>
                      <td>
                        {item.name}
                      </td>
                      <td>
                        {item.address}
                      </td>
                      <td>
                        {item.TransactionOrder &&
                          item.TransactionOrder.map((item, idx) => {
                            return (
                              <section key={idx}>
                                {item.ProductOrder.name}<br /><br />
                              </section>
                            )
                          })
                        }
                      </td>
                      <td>
                        {item.status === 'Waiting Approve' &&
                          <section className={classes.statuss}>
                            <div>
                              <p className={classes.waiting}>{item.status}</p>
                            </div>
                          </section>
                        }
                        {item.status !== 'Waiting Approve' &&
                          <p className={item.status === 'Completed' ?
                            classes.success : item.status === 'On The Way' ?
                              classes.otw : classes.cancel}>{item.status}</p>
                        }
                      </td>
                      <td>
                        {item.status === 'Waiting Approve' &&
                          <section className={classes.confirmButton} key={idx}>
                            <div className={classes.buttonCancel} onClick={() => handleUpdate('Cancel', item.id)}>
                              Cancel
                            </div>
                            <div className={classes.buttonApprove} onClick={() => handleUpdate('On The Way', item.id)}>
                              Approve
                            </div>
                          </ section>
                        }
                        {item.status !== 'Waiting Approve' &&
                          <img className={classes.return}
                            src={item.status === 'Completed' ?
                              Succsess : item.status === 'On The Way' ?
                                Succsess : Cancel} alt='icon-status' />
                        }
                      </td>
                    </tr>
                  </tbody>
                )
              })
            }
          </table>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;