import React from "react";
import { Order, Info, Row, CancelButton, ViewButton } from "./components";
import productPriceFormatter from "../../helpers/ProductPriceFormatter";
import {useNavigate} from "react-router-dom";
import CustomAxios from "../../customer hooks/CustomAxios"
import CancelOrder from "../modals/customer_modals/cancel-order/CancelOrder";
import { useState } from "react";
function PreparingOrder({data, setOrders}) {
  const navigate = useNavigate();
  const [toggleCancel, setToggleCancel] = useState(false);

  const cancelOrder = async () => {
      setToggleCancel(true)
  }
  return (
    <Order key={data.id}> 
    {
      toggleCancel && <CancelOrder setToggleCancel={setToggleCancel} setOrders={setOrders} id={data.id} />
    }
      <img src={data.products[0].imageUrl} />
      <Info>
        <Row>
          <h1>
            Order <span># {data.reference}</span>
          </h1>
        </Row>
        <Row>
          <h4>Total amount of {productPriceFormatter(data.total_amount)}</h4>
        </Row>
        <Row>
          <h3>
            <i className="fa-solid fa-basket-shopping"></i>&nbsp;{" "}
            {data.products.length} items
          </h3>
        </Row>
        <Row>
          <small style={{textTransform:"capitalize"}}>
          <i className="fa-solid fa-credit-card"></i> &nbsp; {data.payment_type} Payment
          </small>
        </Row>
        <Row>
        <ViewButton className="" onClick={() => navigate(`/customer/purchases/${data.reference}`)}>
            View Order
          </ViewButton>
          <CancelButton className="" onClick={cancelOrder}>
            Cancel Order
          </CancelButton>
        </Row>
      </Info>
    </Order>
  );
}

export default PreparingOrder;
