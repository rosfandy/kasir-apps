import React, { useEffect } from "react"
import { useState } from "react"
import axios from 'axios'
import { CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import TableReport from "../components/TableReport"

const Report = () => {
    const [loading, setLoading] = useState(false)
    const [filterOrders, setFilterOrder] = useState([])
    const [orders, setOrders] = useState([])
    const [untung, setUntung] = useState(0)
    const [revenue, setRevenue] = useState(0)
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const responseOrder = await axios.get("http://localhost:8080/data/order");
                if (responseOrder && responseOrder.data) {
                    const filteredOrders = responseOrder.data.filter((order) => {
                        const orderDate = new Date(order.createdAt);
                        const today = new Date();
                        return (
                            orderDate.getDate() === today.getDate() &&
                            orderDate.getMonth() === today.getMonth() &&
                            orderDate.getFullYear() === today.getFullYear()
                        );
                    });

                    setOrders(responseOrder.data);
                    setFilterOrder(filteredOrders);
                    const totalUntung = filteredOrders.reduce((sum, order) => sum + order.untung, 0);
                    const revenue = filteredOrders.reduce((sum, order) => sum + order.total_harga, 0);
                    setRevenue(revenue);
                    setUntung(totalUntung);
                }
                setLoading(false);
                console.log(orders);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        })();
    }, []);


    const formatCurrency = (value) => {
        return value.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
        });
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="">
            <div className="font-bold text-3xl pb-8">Report</div>
            <div className="flex flex-col gap-y-8">
                <div className="bg-white w-fit flex shadow border py-4 px-4 gap-x-10">
                    <div className="revenue">
                        <div className="text-sky-950 text-lg ">Revenue</div>
                        <div className="text-2xl text-sky-950 font-bold">{formatCurrency(revenue)}</div>
                    </div>
                    <div className="">
                        <div className="text-sky-950 text-lg ">Cost</div>
                        <div className="text-2xl text-sky-950 font-bold">Rp 2.000,00</div>
                    </div>
                    <div className="profit">
                        <div className="text-sky-950 text-lg ">Profit</div>
                        <div className="text-2xl text-sky-950 font-bold">{formatCurrency(untung)}</div>
                    </div>
                </div>
                <TableReport setFilterOrder={setFilterOrder} orders={orders} loading={loading} setRevenue={setRevenue} setUntung={setUntung} filterOrders={filterOrders} />
            </div>
        </div>
    )
}

export default Report