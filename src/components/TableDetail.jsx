import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom"
import { AiFillPrinter } from "react-icons/ai";

const TableDetail = ({ orders, loading }) => {
    const navigate = useNavigate()
    useEffect(() => {
        console.log(orders);
        localStorage.setItem("invoice", JSON.stringify(orders));

        // Calculate totalBelanja
        const totalBelanja = orders.reduce((total, order) => {
            return total + order.jumlah * order.harga;
        }, 0);

        console.log("Total Belanja:", totalBelanja);
        localStorage.setItem("total", totalBelanja);
        localStorage.setItem("cash", totalBelanja);
        localStorage.setItem("kembali", 0);

    }, [orders]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    const handleKembali = () => {
        navigate("/")
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className=""><button onClick={handleKembali} className='text-xl pb-8'>{`< Kembali`}</button></div>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
                <div className="flex justify-between">
                    <div className="">
                        <h4 className="text-2xl font-bold  ">
                            {`Daftar Transaksi (${orders[0].order_id})`}
                        </h4>
                        <h4 className="mb-6 text-xl text-black">
                            {`Pembeli: ${orders[0].nama_pembeli ? orders[0].nama_pembeli : "umum"
                                }`}
                        </h4>
                    </div>
                    <div className=""><button onClick={() => navigate("/print")} className='bg-sky-900 px-6 rounded text-lg py-2 text-white flex items-center gap-x-2' type="button">Print <AiFillPrinter size={24} /></button></div>
                </div>
                <div className="flex flex-col">
                    <div className="flex rounded-sm bg-gray-2 border-b-2">
                        <div className="p-2.5 xl:p-5 w-1/4 ">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Kode Barang
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5 w-1/4   ">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Nama Barang
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5 w-1/6 ">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Pembeli
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5 w-1/6">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Jumlah
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5 w-1/6">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Harga
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5 w-1/6">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Total
                            </h5>
                        </div>
                        <div className=" p-2.5 sm:block xl:p-5 w-1/6">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Untung
                            </h5>
                        </div>
                        <div className="hidden p-2.5 sm:block xl:p-5 w-1/4">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Tanggal
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
                            orders.map((order, index) => (
                                <div key={index} className="flex border-b border-stroke items-center">
                                    <div className="p-2.5 xl:p-5 w-1/4">
                                        <h5 className="text-md font-normal xsm:text-base uppercase">{order.id_barang}</h5>
                                    </div>
                                    <div className="p-2.5 xl:p-5 w-1/4">
                                        <h5 className="text-md font-normal xsm:text-base uppercase">{order.nama_barang}</h5>
                                    </div>
                                    <div className="p-2.5 xl:p-5 w-1/6">
                                        <h5 className="text-md font-normal xsm:text-base">{order.nama_pembeli}</h5>
                                    </div>
                                    <div className="p-2.5 xl:p-5 w-1/6">
                                        <h5 className="text-md font-normal pl-4 xsm:text-base">{order.jumlah}</h5>
                                    </div>
                                    <div className="p-2.5 xl:p-5 w-1/6">
                                        <h5 className="text-md font-normal xsm:text-base">Rp {order.harga}</h5>
                                    </div>
                                    <div className="p-2.5 xl:p-5 w-1/6">
                                        <h5 className="text-md font-normal xsm:text-base">Rp {order.jumlah * order.harga}</h5>
                                    </div>
                                    <div className="p-2.5 xl:p-5 w-1/6">
                                        <h5 className="text-md font-normal xsm:text-base">Rp {order.untung * order.jumlah}</h5>
                                    </div>
                                    <div className="p-2.5 xl:p-5 w-1/4">
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
                                </div>
                            ))
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default TableDetail;
