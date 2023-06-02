import { useState } from 'react';

const PaymentForm = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: process.env.NEXT_PUBLIC_CIRCLE_API,
      },
      body: JSON.stringify({
        idempotencyKey: 'ba943ff1-ca16-49b2-ba55-1057e70ca5c7',
        keyId: 'key1',
        metadata: {
          email,
          phoneNumber,
          sessionId: 'DE6FA86F60BB47B379307F851E238617',
          ipAddress: '244.28.239.130',
        },
        amount: { amount, currency },
        autoCapture: true,
        verification: 'none',
        verificationSuccessUrl:
          'https://www.example.com/3ds/verificationsuccessful',
        verificationFailureUrl:
          'https://www.example.com/3ds/verificationfailure',
        source: { id: 'b8627ae8-732b-4d25-b947-1df8f4007a29', type: 'card' },
        description: 'Payment',
        encryptedData: 'UHVibGljS2V5QmFzZTY0RW5jb2RlZA==',
        channel: 'ba943ff1-ca16-49b2-ba55-1057e70ca5c7',
      }),
    };

    fetch('https://api-sandbox.circle.com/v1/payments', options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block mb-2" htmlFor="email">
          Email:
        </label>
        <input
          className="w-full px-3 py-2 border rounded"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="phoneNumber">
          Phone Number:
        </label>
        <input
          className="w-full px-3 py-2 border rounded"
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="amount">
          Amount:
        </label>
        <input
          className="w-full px-3 py-2 border rounded"
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2" htmlFor="currency">
          Currency:
        </label>
        <input
          className="w-full px-3 py-2 border rounded"
          type="text"
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default PaymentForm;
