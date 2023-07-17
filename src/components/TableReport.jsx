import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';

const TableReport = ({
    loading,
    orders,
    filterOrders,
    setRevenue,
    setUntung,
    setFilterOrder
}) => {
    const navigate = useNavigate();
    const [active, setActive] = useState(true);
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);

    const handleDetail = (index) => {
        const orderId = document.querySelectorAll('.order-id');
        console.log(orderId[index].innerHTML);
        localStorage.setItem("order-id", orderId[index].innerHTML)
        navigate("/detailorder")
    }

    const handleHapus = async (index) => {
        const el = document.querySelectorAll('.order-id');
        let order_id = el[index].innerHTML;
        console.log(order_id)
        confirmAlert({
            title: 'Konfirmasi',
            message: 'Apakah Anda yakin ingin menghapus data ini?',
            buttons: [
                {
                    label: 'Ya',
                    onClick: async () => {
                        try {
                            const response = await axios.delete(`http://localhost:8080/data/order/${order_id}`);
                            console.log(response.data);
                            window.location.reload()
                        } catch (error) {
                            console.error(error);
                        }
                    }
                },
                {
                    label: 'Tidak',
                    onClick: () => { }
                }
            ]
        });
    };

    const handleToday = () => {
        setActive(!active)
        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const today = new Date();
            return (
                orderDate.getDate() === today.getDate() &&
                orderDate.getMonth() === today.getMonth() &&
                orderDate.getFullYear() === today.getFullYear()
            );
        });
        setFilterOrder(filteredOrders);
        const totalUntung = filteredOrders.reduce((sum, order) => sum + order.untung, 0);
        const revenue = filteredOrders.reduce((sum, order) => sum + order.total_harga, 0);
        setRevenue(revenue)
        setUntung(totalUntung)
        setFilterStartDate(null);
        setFilterEndDate(null);
    }

    const handleYesterday = () => {
        setActive(!active);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

            return (
                orderDate.getFullYear() === yesterday.getFullYear() &&
                orderDate.getMonth() === yesterday.getMonth() &&
                orderDate.getDate() === yesterday.getDate()
            );
        });

        console.log(filteredOrders);
        setFilterOrder(filteredOrders);
        const totalUntung = filteredOrders.reduce((sum, order) => sum + order.untung, 0);
        const revenue = filteredOrders.reduce((sum, order) => sum + order.total_harga, 0);
        setRevenue(revenue)
        setUntung(totalUntung)
        setFilterStartDate(null);
        setFilterEndDate(null);
    };

    const handleFilter = () => {
        const filteredOrders = orders.filter((order) => {
            if (filterStartDate && filterEndDate) {
                const orderDate = new Date(order.createdAt);
                return (
                    orderDate >= filterStartDate &&
                    orderDate <= filterEndDate
                );
            }
            return true;
        });
        setFilterOrder(filteredOrders);
        const totalUntung = filteredOrders.reduce((sum, order) => sum + order.untung, 0);
        const revenue = filteredOrders.reduce((sum, order) => sum + order.total_harga, 0);
        setRevenue(revenue);
        setUntung(totalUntung);
    };

    return (
        <div className="table bg-white rounded shadow border ">
            <div className="flex border-b-2 items-center w-full justify-between">
                <div className="flex">
                    <div onClick={() => handleToday()} className={`${active ? "border-b-[3px] border-sky-950" : "text-gray-400"} cursor-pointer duration-100 font-semibold py-4 px-6`}>Hari ini</div>
                    <div onClick={() => handleYesterday()} className={`${!active ? "border-b-[3px] border-sky-950" : "text-gray-400"} cursor-pointer duration-100 font-semibold py-4 px-6`}>Kemarin</div>
                </div>
                <div className="filter-tanggal flex items-center">
                    <div className="flex items-center justify-between ">
                        <label htmlFor="start-date">Tanggal Mulai:</label>
                        <input
                            type="date"
                            id="start-date"
                            className="border rounded px-2"
                            value={filterStartDate ? filterStartDate.toISOString().split("T")[0] : ""}
                            onChange={(e) => setFilterStartDate(new Date(e.target.value))}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="end-date">Tanggal Selesai:</label>
                        <input
                            type="date"
                            id="end-date"
                            className="border rounded px-2"
                            value={filterEndDate ? filterEndDate.toISOString().split("T")[0] : ""}
                            onChange={(e) => setFilterEndDate(new Date(e.target.value))}
                        />
                    </div>
                    <button onClick={handleFilter} className="bg-sky-900 text-white rounded ">Filter</button>
                </div>
            </div>
            <div className="">
                <div className="flex rounded-sm bg-gray-2 border-b-2">
                    <div className="hidden p-2.5 sm:block xl:p-5 w-1/6">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Tanggal
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 w-1/6">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            ID Transaksi
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 w-1/6 ">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Pembeli
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 w-1/6">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Total Harga
                        </h5>
                    </div>
                    <div className=" p-2.5 sm:block xl:p-5 w-1/6">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Untung
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 w-1/3">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                        </h5>
                    </div>
                </div>
                {/* Table rows */}
                <div className="overflow-scroll max-h-[40vh]">
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">Tidak ada transaksi</div>
                    ) : (
                        filterOrders.map((order, index) => (
                            <div key={index} className="flex border-b border-stroke items-center">
                                <div className="p-2.5 xl:p-5 w-1/6">
                                    <h5 className="text-md font-normal xsm:text-base">
                                        {new Date(order.updatedAt).toLocaleString('id-ID', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })}
                                    </h5>
                                </div>
                                <div className="p-2.5 xl:p-5 w-1/6">
                                    <h5 className="text-md font-normal xsm:text-base order-id">{order.order_id}</h5>
                                </div>
                                <div className="p-2.5 xl:p-5 w-1/6">
                                    <h5 className="text-md font-normal xsm:text-base">{order.nama_pembeli}</h5>
                                </div>
                                <div className="p-2.5 xl:p-5 w-1/6">
                                    <h5 className="text-md font-normal xsm:text-base">Rp {order.total_harga}</h5>
                                </div>
                                <div className="p-2.5 xl:p-5 w-1/6">
                                    <h5 className="text-md font-normal xsm:text-base">
                                        Rp {order.untung}
                                    </h5>
                                </div>
                                <div className="p-2.5 xl:p-5 w-1/3 flex gap-x-4 items-center">
                                    <div className="text-sm font-normal cursor-pointer xsm:text-base w-1/3 text-center">
                                        <div onClick={(e) => handleDetail(index)} className="border border-sky-900 text-sky-900 rounded-md px-4 py-2">Detail</div>
                                    </div>
                                    <div className="text-sm font-normal cursor-pointer xsm:text-base w-1/3 text-center">
                                        <div onClick={(e) => handleHapus(index)} className="bg-red-500 rounded-md text-white px-4 py-2">Hapus</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default TableReport;
