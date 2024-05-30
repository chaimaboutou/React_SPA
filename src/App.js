import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrderDetails from './Component/OrderDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/order" element={<OrderDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
