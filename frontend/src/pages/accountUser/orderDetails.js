import { Card, CardContent, Typography, Divider } from "@mui/material";

const OrderDetailPage = () => {
  const fakeOrderData = {
    _id: "123456789",
    createdAt: "2025-04-28T12:34:56Z",
    productDetails: [
      {
        image: "https://via.placeholder.com/150",
        name: "Áo thun nam",
        quantity: 2,
        price: 150000
      },
      {
        image: "https://via.placeholder.com/150",
        name: "Quần jeans nữ",
        quantity: 1,
        price: 250000
      }
    ],
    shippingAddress: {
      fullName: "Nguyễn Văn A",
      phone: "0901234567",
      addressLine1: "123 Đường ABC",
      addressLine2: "Khu phố 1",
      city: "Hồ Chí Minh",
      country: "Việt Nam"
    },
    shippingFee: 20000,
    totalAmount: 570000,
    paymentDetails: {
      payment_status: "Đã thanh toán",
      payment_method_type: ["Thẻ tín dụng"]
    },
    status: "Đang xử lý"
  };

  const {
    _id,
    createdAt,
    productDetails,
    shippingAddress,
    shippingFee,
    totalAmount,
    paymentDetails,
    status
  } = fakeOrderData;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Typography variant="h5" className="text-center">
        Chi tiết đơn hàng #{_id}
      </Typography>

      <Card>
        <CardContent className="flex justify-between items-center">
          <div>
            <Typography className="text-gray-600">Trạng thái</Typography>
            <Typography className="font-medium capitalize">{status}</Typography>
          </div>
          <div>
            <Typography className="text-gray-600">Ngày đặt</Typography>
            <Typography>{new Date(createdAt).toLocaleDateString()}</Typography>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" className="mb-2 font-medium">
            Sản phẩm
          </Typography>
          <Divider className="mb-3" />
          <div className="space-y-3">
            {productDetails.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <Typography className="font-medium">{item.name}</Typography>
                    <Typography className="text-sm text-gray-600">
                      Số lượng: {item.quantity}
                    </Typography>
                  </div>
                </div>
                <Typography className="text-right">
                  {(item.price * item.quantity).toLocaleString()}₫
                </Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" className="mb-2 font-medium">
            Giao hàng đến
          </Typography>
          <Divider className="mb-2" />
          <Typography>
            {shippingAddress.fullName} - {shippingAddress.phone}
          </Typography>
          <Typography className="text-gray-700">
            {shippingAddress.addressLine1}, {shippingAddress.addressLine2},{" "}
            {shippingAddress.city}, {shippingAddress.country}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" className="mb-2 font-medium">
            Thanh toán
          </Typography>
          <Divider className="mb-2" />
          <Typography>
            Trạng thái: {paymentDetails.payment_status}
          </Typography>
          <Typography>
            Hình thức: {paymentDetails.payment_method_type?.join(", ")}
          </Typography>
          <Divider className="my-3" />
          <div className="flex justify-between font-semibold">
            <span>Tổng tiền:</span>
            <span>{totalAmount.toLocaleString()}₫</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
