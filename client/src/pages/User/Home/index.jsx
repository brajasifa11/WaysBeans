import React, { useState, useEffect } from "react";
import classes from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { convertRupiah } from "../../../utils/RupiahFormat";

import Jumbotron from "../../../static/images/Jumbotron.png";
import { API } from "../../../config/api";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const toProduct = (productId, productName) => {
    navigate(`/product/${productName}`, {
      state: {
        productId,
      },
    });
  };

  const getProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data.data.products);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wraper}>
        <div className={classes.jumbotron}>
          <img src={Jumbotron} alt="jumbotron" />
        </div>
        <div className={classes.displays}>
          {products &&
            products.map((item, idx) => {
              return (
                <div
                  className={classes.card}
                  onClick={() => toProduct(item.id, item.name)}
                  key={idx}
                >
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
                      <p className={classes.stock}>Stock : {item.stock}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Home;
