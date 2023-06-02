import PaymentForm from '../components/PaymentForm';
import { useState } from 'react';

const Checkout = () => {
  const [showmodal, setShowmodal] = useState(false);
  return (
    <div>
      <h1>Payment Form</h1>
      <button onClick={() => setShowmodal(true)}>Pay with Circle</button>
      { showmodal && <PaymentForm /> }
    </div>
  );
};

export default Checkout;
