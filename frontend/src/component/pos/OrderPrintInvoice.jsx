// import React from 'react';
// import { useReactToPrint } from 'react-to-print';
// import PrintInvoice from './PrintInvoice';
// import { message } from 'antd';
// import PropTypes from 'prop-types';
// import './print.css';

// const OrderPrintInvoice = ({ printData, onPrintComplete }) => {
//     const componentRef = React.useRef();

//     const handlePrint = React.useCallback(
//         useReactToPrint({
//             content: () => componentRef.current,
//             onAfterPrint: () => {
//                 if (onPrintComplete) {
//                     onPrintComplete();
//                 }
//             },
//             onPrintError: (error) => {
//                 console.error('Print failed:', error);
//                 message.error('Failed to print');
//             }
//         }),
//         [onPrintComplete]
//     );

//     React.useEffect(() => {
//         if (printData && componentRef.current) {
//             // Small delay to ensure component is rendered
//             // setTimeout(handlePrint, 100);
//         }
//     }, [printData, handlePrint]);

//     if (!printData) {
//         return null;
//     }

//     return (
//         <div className="print-container" style={{ display: 'none' }}>
//             <PrintInvoice
//                 ref={componentRef}
//                 cart_list={printData.cart_list || []}
//                 objSummary={printData.objSummary || {}}
//             />
//         </div>
//     );
// };

// OrderPrintInvoice.propTypes = {
//         printData: PropTypes.shape({
//             cart_list: PropTypes.array,
//             objSummary: PropTypes.object,
//         }),
//         onPrintComplete: PropTypes.func,
// };
// export default OrderPrintInvoice;
