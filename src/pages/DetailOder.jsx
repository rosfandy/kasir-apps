import TableDetail from "../components/TableDetail"
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const DetailOrder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch orders from the server
        const order_id = localStorage.getItem("order-id")
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/data/detailorder/${order_id}`);
                setOrders(response.data);
                console.log(response.data)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="DetailOrder">
            <div className=" font-bold text-3xl">Product</div>
            <div className="">
                <TableDetail orders={orders} loading={loading} />
            </div>
        </div>
    )
}

export default DetailOrder