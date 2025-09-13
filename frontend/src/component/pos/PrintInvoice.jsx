import React from "react";
import PropTypes from "prop-types";
import "./Print.css";
import Logo from "../../assets/v-friends.jpg"
const PrintInvoice = React.forwardRef(({ cart_list = [], objSummary = {}, cashier = '' }, ref) => {
  // Get customer name from objSummary, handle both direct name and customer object
  //const customerName = typeof objSummary?.customer_name === 'string' ? objSummary.customer_name : 'Guest';
  const customerDisplay = typeof objSummary?.customer_id === 'string' ? objSummary.customer_id : 'Customer VIP';

  // Get payment method from objSummary
  const paymentMethod = objSummary?.payment_method || 'Cash';

  // Use the cashier prop passed from parent
  const cashierName = cashier || 'System';
  const generateInvoiceNumber = () => {
    // const {config} = configStore
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toFixed(2) + ' $';
  };
  const handlePrint = () => {
    const printButtons = document.querySelector('.print-buttons');

    if (printButtons) { 
      printButtons.style.display = 'none'; 
      window.print(); 
      printButtons.style.display = 'block';
    }
  }; 

  const handleClose = () => {
    window.close();
  };

  const findTotalItem = (item) => {
    let total = item.cart_qty * parseFloat(item.price || 0);
    if (item.discount) {
      let discount_price = (total * parseFloat(item.discount || 0)) / 100;
      total = total - discount_price;
    }
    return formatCurrency(total);
  };

  return (
    <div className="invoice-page">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Invoice</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></link>
      <div className="container" style={{ padding: '0', margin: '0 auto', maxWidth: '500px' }} ref={ref}>
        <div className="invoice-container">
          {/* Invoice Header */}
          <div className="invoice-header row">
            <div className="col-6 d-flex">
              {/* logo */}
              <div >
                <img
                  src={Logo}
                  alt="V-Friends Coffee Logo"
                  className="logo"
                  style={{
                    width: '50px',
                    height: '50px',
                    display: 'block',
                    margin: '0 auto',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ddd'

                  }}
                />
              </div>
              <div>
                <h4 className="invoice-title" style={{ color: '#1890ff', marginBottom: '10px',fontSize: '26px' }}>V-Friends Coffee</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Sihanoukville (city), Cambodia</p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Tel: (855) 070-715-751</p>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>Email: VfriendCoffee10@gmail.com</p>
              </div>
            </div>
            <div className="col-6 text-end">
              <h2>INVOICE</h2>
              <p>Invoice #: {objSummary.order_no || generateInvoiceNumber()}</p>
              <p>Date: {objSummary.order_date ? new Date(objSummary.order_date).toLocaleDateString() : new Date().toLocaleDateString()}</p>
              {/* <p>Time: {objSummary.order_date ? new Date(objSummary.order_date).toLocaleTimeString() : new Date().toLocaleTimeString()}</p> */}
              <p>Time: {objSummary.order_date ? new Date(objSummary.order_date).toLocaleTimeString('en-US', { hour12: false }) : new Date().toLocaleTimeString('en-US', { hour12: false })}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="invoice-details row">
            <div className="col-6">
              <h5>Bill To:</h5>
              <p className="mb-0" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អតិថិជន: {customerDisplay}</p>
              <p>Payment Method: {paymentMethod}</p>
            </div>
            <div className="col-6 text-end">
              <p className="mb-0" style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' }}>អ្នកគិតលុយ: {cashier || 'Unknown'}</p>
              <p>Terminal: V-Friends</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-responsive mt-4">
            <table className="table table-items">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Price</th>
                  <th className="text-center">Discount</th>
                  {/* <th className="text-center">Sugar</th> */}
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cart_list) && cart_list.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td style={{ fontFamily: 'Noto Sans Khmer, Roboto, sans-serif' ,fontWeight:'bold'}}>{item.name} {item.sugarLevel}%</td>
                    <td className="text-center">{item.cart_qty} </td>
                    <td className="text-end">{formatCurrency(item.price)}</td>
                    <td className="text-center">{item.discount}%</td>
                    {/* <td className="text-center">{item.sugarLevel}%</td> */}
                    <td className="text-end">{findTotalItem(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          {/* Invoice Summary  */}
          <div className="invoice-total row">
            <div className="col-6">
              <div className="mt-4">
                <p className="mb-1"><strong>Customer:</strong> {customerDisplay}</p>
                <p className="mb-1"><strong>Payment Method:</strong> {paymentMethod}</p>
                <p className="mb-1"><strong>Cashier:</strong> {cashierName}</p>
                <p className="mb-1">Thank you for your purchase!</p>
                <p className="mb-1">Please come again...!</p>
              </div>
            </div>
            <div className="col-6">
              <div className="text-end">
                <div className="row justify-content-end">
                  <div className="col-7">
                    <p className="mb-2" style={{fontWeight:'bold'}}>Subtotal:</p>
                    <p className="mb-2">Savings:</p>
                    <p className="mb-2">Total Amount:</p>
                    <p className="mb-2">Amount Paid:</p>
                    <p className="mb-0">Change:</p>
                  </div>
                  <div className="col-5 text-end">
                    <p className="mb-2">{formatCurrency(objSummary.sub_total)}</p>
                    <p className="mb-2">{formatCurrency(objSummary.save_discount)}</p>
                    <p className="mb-2">{formatCurrency(objSummary.total)}</p>
                    <p className="mb-2">{formatCurrency(objSummary.total_paid)}</p>
                    <p className="mb-0">{formatCurrency(objSummary.total_paid - objSummary.total)}</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 print-buttons" >
          <button className="btn btn-primary me-2" onClick={handlePrint} style={{ backgroundColor: '#1890ff', border: 'none', padding: '8px 16px' }}>Print </button>
          <button className="btn btn-secondary" onClick={handleClose} style={{ backgroundColor: '#6c757d', border: 'none', padding: '8px 16px' }}>Close</button>
        </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    </div>
  );
});

PrintInvoice.propTypes = {
  cart_list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      cart_qty: PropTypes.number.isRequired,
      price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      discount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    })
  ),
  objSummary: PropTypes.shape({
    customer_id: PropTypes.string, 
    payment_method: PropTypes.string,
    total: PropTypes.number,
    total_paid: PropTypes.number
  }),
  cashier: PropTypes.string.isRequired
};

PrintInvoice.displayName = "PrintInvoice";

PrintInvoice.defaultProps = {
  cart_list: [],
  objSummary: {
    total_qty: 0,
    sub_total: 0,
    save_discount: 0,
    total: 0,
    total_paid: 0,
    customer_id: '',
    order_no: '',
    order_date: '',
  },
  cashier: 'Unknown'
};

export default PrintInvoice;