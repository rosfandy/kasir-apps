import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import { printInvoice } from '../ipcRenderer';
const ComponentToPrint = () => {
    const [array, setArray] = useState([]);
    const [tanggal, setTanggal] = useState([]);
    const [waktu, setWaktu] = useState([]);

    useEffect(() => {
        moment.locale('id');
        const invoiceData = JSON.parse(localStorage.getItem('invoice'));
        const total = formatCurrency(parseFloat(localStorage.getItem('total')));
        const cash = formatCurrency(parseFloat(localStorage.getItem('cash')));
        const kembali = formatCurrency(parseFloat(localStorage.getItem('kembali')));
        setTanggal(moment().format('LL'));
        setWaktu(moment().format('LT'));

        const combinedArray = [invoiceData, total, cash, kembali, moment().format('LL'), moment().format('LT')];
        setArray(combinedArray);
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
        });
    };

    const handlePrint = () => {
        const invoiceElement = document.querySelector('.invoice');
        console.log(array);
        printInvoice(JSON.stringify(array));
    };

    const [invoiceData, total, cash, kembali] = array;

    if (!invoiceData) {
        return null; // Return null or some loading state if invoiceData is undefined
    }

    return (
        <div className="">
            <div className="invoice w-[188.98px] border flex flex-col bg-white text-xs">
                <div className="px-2 py-4">
                    <div className="text-center pb-2">
                        <div className="font-bold">BISMILLAH MART</div>
                        <div className="">Taman Gading P-10 Jember</div>
                    </div>
                    <div className="">-----------------------------------</div>
                    <div className="con-item flex flex-col gap-y-2">
                        {invoiceData.map((invoice, index) => (
                            <div key={index} className="item">
                                <div className="uppercase">{invoice.nama_barang}</div>
                                <div className="flex justify-between">
                                    <div className="jml-harga">{`${invoice.jumlah}@${invoice.harga}`}</div>
                                    <div className="">{`${formatCurrency(invoice.jumlah * invoice.harga)}`}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="">-----------------------------------</div>
                    <div className="item">
                        <div className="flex justify-between ">
                            <div className="font-bold text-sm">Total</div>
                            <div className="font-bold text-sm">{formatCurrency(total)}</div>
                        </div>
                        <div className="">-----------------------------------</div>
                        <div className="flex justify-between">
                            <div className="text-xs">Cash</div>
                            <div className="text-xs">{formatCurrency(cash)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-xs" >Kembali</div>
                            <div className="text-xs">{formatCurrency(kembali)}</div>
                        </div>
                        <div className="text-center pt-3">{tanggal} {waktu}</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <button
                    onClick={handlePrint}
                    className="bg-sky-900 text-white py-2 px-12 mt-4 rounded"
                >
                    Print
                </button>
            </div>
        </div>
    );
};

export default ComponentToPrint;
