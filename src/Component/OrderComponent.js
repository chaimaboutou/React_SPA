
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './OrderComponent.css';

const OrderComponent = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [orderResponse, setOrderResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const query = new URLSearchParams(useLocation().search);
    const itemsJson = query.get('items');



    useEffect(() => {
        if (itemsJson) {
            const items = JSON.parse(decodeURIComponent(itemsJson));
            setOrderItems(items.items || []);
        }
        const fetchOrderData = async () => {
            try {
                const response = await axios.post('http://localhost:9001/place', {
                    orderItems
                });
                console.log(response.data);
                setOrderResponse(response.data);
            } catch (error) {
                console.error('Error placing order:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orderItems.length > 0) {
            fetchOrderData();
        }
    }, [itemsJson]);

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
                            <span>Order ID:</span>
                            <span>{orderResponse.orderId}</span>
                        </div>
                        <div className="bill-item">
                            <span>Total Cost:</span>
                            <span>{orderResponse.totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="bill-header">Items</div>
                    {orderResponse.orderItems.map((item, index) => (
                        <div key={index} className="bill-item">
                            <span>{item.itemName}</span>
                            <span>Price: {item.price}</span>
                            <span>Quantity: {item.quantity}</span>

                        </div>
                    ))}
                    <div className="bill-footer">
                        <span>Total:</span> {orderResponse.totalCost.toFixed(2)}
                    </div>
                </>
            ) : (
                <p>No order response received.</p>
            )}
        </div>
    );
};

export default OrderComponent;
