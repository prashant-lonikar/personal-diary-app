import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

function Spinner({ animation = "border", size = "sm", variant = "primary" }) {
  return (
    <div className="d-flex justify-content-center my-3">
      <BootstrapSpinner animation={animation} size={size} variant={variant} />
    </div>
  );
}

export default Spinner;