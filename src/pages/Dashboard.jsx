import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { IoReceiptOutline } from "react-icons/io5";
import { PiPlusCircleBold } from "react-icons/pi";
import { MdOutlineAttachMoney } from "react-icons/md";
import Tables from '../components/TablesTransaction';
import axios from 'axios';

const Dashboard = () => {
    const currentDateTime = moment().tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm:ss');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await axios.get('http://localhost:8080/data/order');
            const filteredOrders = response.data.filter((order) => {
                const orderDate = new Date(order.createdAt);
                const today = new Date();
                return (
                orderDate.getDate() === today.getDate() &&
                orderDate.getMonth() === today.getMonth() &&
                orderDate.getFullYear() === today.getFullYear()
                );
            });
            setOrders(filteredOrders);
            setLoading(false);
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const totalUntung = orders
        .map((order) => order.untung)
        .reduce((total, untung) => total + untung, 0)
        .toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

    const totalPemasukan = orders
        .map((order) => order.total_harga)
        .reduce((total, harga) => total + harga, 0)
        .toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });


  return (
    <div className="Dashboard">
        <div className="Tanggal font-semibold text-2xl">{currentDateTime}</div>
        <div className="flex gap-x-4 mt-8">
            <div className="flex flex-col gap-y-4  bg-[#003049] text-white w-[20%] py-5 px-6 rounded-md">
                <IoReceiptOutline size={32}/>
                <div className="">
                    <div className="font-bold text-2xl">{orders.length}</div>
                    <div className="">Jumlah Transaksi</div>
                </div>
            </div>
            <div className="flex flex-col gap-y-4  bg-[#003049] text-white w-[20%] py-5 px-6 rounded-md">
                <MdOutlineAttachMoney size={32}/>
                <div className="">
                    <div className="font-bold text-2xl">{totalPemasukan}</div>
                    <div className="">Total Pemasukan</div>
                </div>
            </div>
            <div className="flex flex-col gap-y-4  bg-[#003049] text-white w-[20%] py-5 px-6 rounded-md">
                <PiPlusCircleBold size={32}/>
                <div className="">
                    <div className="font-bold text-2xl">{totalUntung}</div>
                    <div className="">Total Untung</div>
                </div>
            </div>
        </div>
        <Tables orders={orders} loading={loading}/>
    </div>
  );
};

export default Dashboard;
