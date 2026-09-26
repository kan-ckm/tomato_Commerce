import React, { useEffect, useState } from 'react';
import Flag from 'react-world-flags';
import SummaryApi from '../../common';
import moment from 'moment';
import displayVNDCurrency from '../../helpers/displayINRCurrency';
import { Collapse } from 'react-collapse';

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const fetchOrderDetail = async () => {
    const res = await fetch(SummaryApi.getOrder.url, {
      method: SummaryApi.getOrder.method,
      credentials: 'include',
    });
    const resData = await res.json();
    setData(resData.data);
  };

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  return (
    <div>
      {data.length === 0 && (
        <div className="flex justify-center items-center bg-white w-full shadow-md rounded-sm h-40">
          <p className="font-semibold text-xl">No order</p>
        </div>
      )}

      <div className="p-4 w-full max-w-5xl mx-auto space-y-6">
        {data.map((item, index) => (
          <div key={item.userId + index} className="border rounded bg-white shadow-md p-4 space-y-3">
            <p className="font-medium text-base text-gray-600">{moment(item.createdAt).format('LL')}</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4 col-span-2">
                {item.productDetails.slice(0, showAllProducts ? item.productDetails.length : 3).map((product, i) => (
                  <div key={product.productId + i} className="flex gap-3">
                    <img src={product.image[0]} className="w-24 h-24 object-contain border rounded p-1" />
                    <div className="flex flex-col justify-between">
                      <div className="font-medium text-base text-gray-800 line-clamp-1">{product.name}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="text-red-500 font-semibold">{displayVNDCurrency(product.price)}</span>
                        <span>x{product.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {item.productDetails.length > 3 && (
                  <button
                    className="button rounded-full transition duration-300"
                    onClick={() => setShowAllProducts((prev) => !prev)}
                  >
                    {showAllProducts ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-slate-50 rounded-md shadow-sm p-4 text-sm">
                  <div className="text-base font-semibold mb-2">Shipping Details</div>
                  {item.shipping_options.map((shipping, i) => (
                    <div key={shipping.shipping_rate}>Shipping: {displayVNDCurrency(shipping.shipping_amount)}</div>
                  ))}
                  <div>Phone: {item.customer_phone}</div>
                  <div>Name: {item.name}</div>
                  <div>
                    Address: {item.shipping_address.line1}, {item.shipping_address.line2}, {item.shipping_address.state}
                  </div>
                  <div className="flex items-center gap-1">
                    Country: {item.shipping_address.country}
                    <Flag code={item.shipping_address.country.toLowerCase()} style={{ width: '14px' }} />
                  </div>
                  <div>Postal Code: {item.shipping_address.postal_code}</div>
                </div>

                <div className="bg-slate-50 rounded-md shadow-sm p-4 text-sm">
                  <div className="text-base font-semibold mb-2">Payment Details</div>
                  <div>Method: {item.paymentDetails.payment_method_type[0]}</div>
                  <div>Status: {item.paymentDetails.payment_status}</div>
                </div>
              </div>
            </div>

            <div className="text-right font-semibold text-lg text-gray-800 border-t pt-3">
              Total: {displayVNDCurrency(item.totalAmount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
