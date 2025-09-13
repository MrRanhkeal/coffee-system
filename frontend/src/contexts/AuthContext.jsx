// import { PropTypes } from 'prop-types';
// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     // In real life, you'd get this from login or JWT
//     const [role, setRole] = useState('cashier'); // or 'admin'

//     return (
//         <AuthContext.Provider value={{ role, setRole }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// AuthProvider.propTypes = {
//     children: PropTypes.node.isRequired,
// };
// export const useAuth = () => useContext(AuthContext);