import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './OrderComponent.css';

const OrderDetails = () => {
    const [orderResponse, setOrderResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const itemsJson = query.get('items');

    const [dateTime, setDateTime] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        if (itemsJson && !requestSent) {
            const items = JSON.parse(decodeURIComponent(itemsJson));

            const now = new Date();
            const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
            setDateTime(formattedDateTime);

            axios.post('http://localhost:9001/api/order', items.items, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setOrderResponse(response.data);
                    setLoading(false);
                    setRequestSent(true);
                })
                .catch(error => {
                    console.error('Error fetching order details:', error);
                    setLoading(false);
                    setRequestSent(false);
                });
        }
    }, [itemsJson, requestSent]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bill-container">
            {orderResponse ? (
                <>
                    <div className="bill-header">Order Details</div>
                    <div className="bill-details">
                        <div className="bill-item">
                            <span>Date and Time:</span>
                            <span>{dateTime}</span>
                        </div>
                        <div className="bill-item">
                            <span>Total Cost of the order:</span>
                            <span>{parseFloat(orderResponse.totalCost).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="bill-header">Items</div>
                    {orderResponse.orderItems.map((item, index) => (
                        <div key={index} className="bill-item">
                            <span>{item.itemName}</span>
                            <span>Price: {parseFloat(item.price).toFixed(2)}</span>
                            <span>Quantity: {item.quantity}</span>
                        </div>
                    ))}
                    <div className="bill-footer">
                        <span>Total:</span> {parseFloat(orderResponse.totalCost).toFixed(2)}
                    </div>
                </>
            ) : (
                <p>No order response received.</p>
            )}
        </div>
    );
};

export default OrderDetails;
