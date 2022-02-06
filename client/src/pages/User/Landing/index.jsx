import React,
{
  useEffect,
  // useEffect,
  useState
}
  from 'react';
import classes from './index.module.scss';
import { Navbar } from '../../../components/Navbar';
import { Display } from '../../../components/Display';
import Jumbotron from '../../../static/images/Jumbotron.png';
import { API } from '../../../config/api';

const Landing = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data.data.products)
    } catch (error) {
      console.log(error)
    };
  };
  useEffect(() => {
    getProducts();
  }, []);

  const [show, setShow] = useState(false);
  const [nameModal, setNameModal] = useState('');
  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        <Navbar show={show} setShow={setShow} nameModal={nameModal} setNameModal={setNameModal} />
      </div>
      <div className={classes.jumbotron}>
        <img src={Jumbotron} alt='jumbotron' />
      </div>
      <div className={classes.displays}>
        <Display show={show} setShow={setShow} nameModal={nameModal} setNameModal={setNameModal} products={products} />
      </div>
    </div>
  )
}

export default Landing;