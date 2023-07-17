import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { ImCross } from 'react-icons/im';
import { CircularProgress } from '@mui/material';
import ConfirmAlert from "../components/Confirmation"

const Invoice = () => {
    const searchInputRef = useRef(null);
    const [cartItems, setCartItems] = useState([]);
    const [isPrint, setIsPrint] = useState(false)
    const [inputUang, setInputUang] = useState('');
    const [isClose, setIsClose] = useState(true);
    const [uangKembali, setUangKembali] = useState(0);
    const [pointBelanja, setPointBelanja] = useState(0);
    const [isValid, setIsValid] = useState(false);
    const [dataPoints, setDataPoints] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [onConfirmation, setOnConfirmation] = useState(false)
    const [isAlert, setIsAlert] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/data/point');
                setDataPoints(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log(onConfirmation)
        if (isAlert === false) {
            if (onConfirmation === true) handleBayar()
        }
    }, [isAlert])

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
        setCartItems(storedCartItems);

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                navigate('/order', { state: { fromInvoice: true } });
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, [navigate]);

    const handlerBack = () => {
        navigate('/order', { state: { fromInvoice: true } });
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        console.log('val: ', selectedOption.value)
    };

    const totalBelanja = cartItems.reduce((total, item) => {
        const harga = parseFloat(item.harga);
        const jumlah = parseFloat(item.jumlah);
        if (isNaN(harga) || isNaN(jumlah) || harga <= 0 || jumlah <= 0) {
            return total;
        }
        return total + harga * jumlah;
    }, 0);

    const totalUntung = cartItems.reduce((acc, item) => {
        const penjualan = item.jual * item.jumlah;
        const biayaPembelian = item.beli * item.jumlah;
        const keuntungan = penjualan - biayaPembelian;
        return acc + keuntungan;
    }, 0);

    const handleBayarWithConfirmation = () => {
        setIsAlert(true)
    };

    const handleBayar = () => {
        const detailOrder = cartItems.map((item) => ({
            id_barang: item.kode_barang,
            nama_barang: item.nama_barang,
            jumlah: item.jumlah,
            harga: item.harga,
            nama_pembeli: selectedOption ? selectedOption.label : 'umum',
            untung: (item.harga * item.jumlah) - (item.beli * item.jumlah),
        }));

        console.log('detail: ', detailOrder);
        const inputUangValue = parseFloat(inputUang);
        if (isNaN(inputUangValue) || inputUangValue <= 0) {
            toast.error('Masukkan jumlah uang yang valid!');
            setIsClose(false);
            setIsValid(false);
        } else if (inputUangValue < totalBelanja) {
            toast.error('Uang yang dimasukkan kurang!');
            setIsClose(false);
            setIsValid(false);
        } else {
            setIsClose(false);
            setIsValid(true);
            localStorage.setItem('cash', inputUang)
            console.log(inputUangValue);
            let kembalian = parseFloat(inputUangValue - totalBelanja);
            setUangKembali(kembalian);
            localStorage.setItem('kembali', kembalian)
            setLoading(true);

            const transactionData = {
                untung: totalUntung,
                nama_pembeli: selectedOption ? selectedOption.label : 'umum',
                total_harga: totalBelanja,
            };

            let pointPromise = Promise.resolve();
            const poin = Math.floor(totalBelanja / 10000);
            setPointBelanja(poin);
            if (selectedOption) {

                pointPromise = axios.post(
                    `http://localhost:8080/data/point/${selectedOption.value}`,
                    { total_point: poin },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            const productPromises = cartItems.map((item) => {
                const { kode_barang, jumlah, stok } = item;
                let jml = (parseFloat(stok) - parseFloat(jumlah)).toFixed(2);
                console.log("barang: ", kode_barang);
                console.log("stok: ", jml);
                return axios
                    .post(
                        `http://localhost:8080/data/product/${kode_barang}`,
                        { stok: jml },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    )
                    .then((response) => {
                        console.log('Response dari update stok:', response.data);
                        return response;
                    });
            });

            axios
                .post('http://localhost:8080/data/order', transactionData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    const order_id = response.data.order_id;
                    const detailOrderData = {
                        order_id: order_id,
                        detailOrder: { ...detailOrder }
                    };

                    console.log("detail: ", detailOrderData)
                    const detailOrderPromise = axios.post(
                        'http://localhost:8080/data/detailorder',
                        detailOrderData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    const promises = [detailOrderPromise, pointPromise, ...productPromises];

                    return Promise.all(promises);
                })
                .then((responses) => {
                    console.log(responses[0].data);
                    if (selectedOption) console.log(responses[1].data);
                    setLoading(false);
                    toast.success('Terima kasih atas pembayarannya!');
                    const invoice = detailOrder.map((item) => ({ ...item }));
                    localStorage.setItem('invoice', JSON.stringify(invoice));
                    localStorage.setItem('total', totalBelanja);
                    setIsPrint(true)
                    // navigate('/print')
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                    toast.error('Terjadi kesalahan. Silakan coba lagi.');
                });
        }
    };

    const mappedDataPoints = dataPoints.map((dataPoint) => ({
        value: dataPoint.id_pembeli,
        label: dataPoint.nama_pembeli,
    }));

    return (
        <div className="Invoice">
            {isAlert ?
                <ConfirmAlert onConfirmation={setOnConfirmation} isAlert={setIsAlert} /> : null
            }
            <div className="font-bold text-3xl pb-6">Invoice</div>
            <div className="">
                <div className="shadow mb-4 w-full bg-white border px-5 py-6 rounded-md h-min">
                    <div
                        className="font-semibold text-gray-500 cursor-pointer text-lg"
                        onClick={handlerBack}
                    >
                        {'< Kembali'}
                    </div>

                    <div className="py-4 px-2 overflow-scroll max-h-[30vh]">
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500">Keranjang belanja kosong.</p>
                        ) : (
                            <div className="flex flex-col gap-y-3">
                                {cartItems.map((item, index) => (
                                    <div className="flex" key={index}>
                                        <div className="flex w-5/6 border bg-sky-100 border-black/30 text-sky-700 px-4 py-2 rounde-sm justify-between">
                                            <div className="font-semibold text-lg uppercase">{`${item.nama_barang}`}</div>
                                            <div className="cart-jml font-semibold text-lg">
                                                {item.jumlah} @ Rp {item.harga}
                                            </div>
                                        </div>
                                        <div className="flex w-1/6 border bg-green-50 border-black/30 px-4 text-green-700 py-2 rounde-sm justify-between">
                                            <div className="text-end w-full font-semibold text-lg ">
                                                {`Rp ${item.jumlah * item.harga}`}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center mt-8 mb-5 border border-green-700  bg-green-200 py-2">
                        <div className="flex gap-x-4">
                            <h4 className="mb-2 text-3xl font-semibold text-green-800">
                                Total Belanja :
                            </h4>
                            <h4 className="mb-2 text-3xl font-semibold normal-case text-green-800">
                                {`Rp ${totalBelanja}`}
                            </h4>
                        </div>
                    </div>
                    {!isClose ? (
                        isValid ? (
                            <div className="flex justify-between mt-5 px-3 border border-green-500 bg-green-200 py-2">
                                <h4 className="mb-2 text-2xl font-semibold text-green-800 text-center w-full">
                                    {`Kembali : Rp ${uangKembali}  (${pointBelanja} Point)`}
                                </h4>
                                <button
                                    className="text-green-800"
                                    onClick={() => setIsClose(true)}
                                >
                                    <ImCross />
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between mt-5 px-3 border border-red-500 bg-red-200 py-2">
                                <h4 className="mb-2 text-2xl font-semibold text-red-700 text-center w-full">
                                    Pembayaran Gagal
                                </h4>
                                <button
                                    className="text-red-700"
                                    onClick={() => setIsClose(true)}
                                >
                                    <ImCross />
                                </button>
                            </div>
                        )
                    ) : null}

                    <div className="px-2">
                        <div className="py-2 font-bold">{`Masukkan Uang (Rp)`}</div>
                        <div className="flex flex-col w-full gap-y-6">
                            <div className="">
                                <input
                                    type="number"
                                    className="border border-black/30 w-full rounded py-2 px-4"
                                    placeholder="Masukkan Jumlah Uang"
                                    value={inputUang}
                                    onChange={(e) => setInputUang(e.target.value)}
                                    ref={searchInputRef}
                                />
                            </div>
                        </div>
                        <div className="py-2 font-bold">Masukkan Pembeli</div>
                        <div className="flex flex-col w-full gap-y-6">
                            <div className="">
                                <Select
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                    options={mappedDataPoints}
                                    placeholder="Pilih Pembeli"
                                />
                            </div>
                        </div>
                        <button
                            className={`w-full rounded uppercase px-8 py-2 mt-4 ${cartItems.length === 0 ? 'bg-slate-200' : 'bg-sky-900'
                                } text-white`}
                            disabled={cartItems.length === 0}
                            onClick={handleBayarWithConfirmation}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Bayar'
                            )}
                        </button>
                        {isPrint ?
                            <button
                                className={`w-full rounded uppercase px-8 py-2 mt-4 border-2 border-sky-900
                            text-sky-900 font-bold`}
                                onClick={() => navigate('/print')}
                            >
                                Print
                            </button>
                            : null
                        }

                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Invoice;
