import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { ImBin } from "react-icons/im";
import { useLocation, useNavigate } from 'react-router-dom';


const TableOrder = () => {
  const location = useLocation();
  const { fromInvoice } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const itemsPerPage = 50;
  const pageRangeDisplayed = 5;
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (fromInvoice) {
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
      setCartItems(storedCartItems);
    }
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/data/product');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log(cartItems)
  }, [cartItems])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        navigate('/invoice');
      } else if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);


  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredOrders = orders.filter((order) =>
    order.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const pageNumbers = [];

  if (totalPages <= pageRangeDisplayed) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const leftOffset = Math.floor((pageRangeDisplayed - 1) / 2);
    const rightOffset = pageRangeDisplayed - 1 - leftOffset;
    let startPage = currentPage - leftOffset;
    let endPage = currentPage + rightOffset;

    if (startPage <= 0) {
      endPage += Math.abs(startPage) + 1;
      startPage = 1;
    }

    if (endPage > totalPages) {
      startPage -= endPage - totalPages;
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClick = (index) => {
    const quantityInput = document.getElementById(`quantity-${index}`);
    if (quantityInput) {
      quantityInput.focus();
      quantityInput.select();
    }
  };

  const handleBuy = (index) => {
    const selectedOrder = currentItems[index];
    const existingItem = cartItems.find((item) => item.nama_barang === selectedOrder.nama_barang);
    const hargaElements = document.querySelectorAll('.harga');
    const harga = hargaElements[index].innerText; // Mengambil nilai harga dari elemen HTML

    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item.nama_barang === selectedOrder.nama_barang
          ? { ...item, jumlah: item.jumlah + selectedQuantity }
          : item
      );
      setCartItems(updatedItems);
    } else {
      const newItem = {
        ...selectedOrder,
        jumlah: selectedQuantity,
        harga: parseFloat(harga.replace(/[^0-9.-]+/g, '')), // Mengkonversi harga menjadi tipe float
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleRemoveCartItem = (index) => {
    const updatedItems = cartItems.slice(); // Create a copy of cartItems
    updatedItems.splice(index, 1); // Remove the item at the specified index
    setCartItems(updatedItems); // Update the state with the updated array
  };

  const totalBelanja = cartItems.reduce((total, item) => {
    const harga = parseFloat(item.harga);
    const jumlah = parseFloat(item.jumlah);
    if (isNaN(harga) || isNaN(jumlah) || harga <= 0 || jumlah <= 0) {
      return total;
    }
    return total + harga * jumlah;
  }, 0);

  const handleBayar = () => {
    if (cartItems.length === 0) {
      return;
    }
    navigate('/invoice');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-row gap-x-4">
      <div className="rounded-sm border border-stroke w-4/5 bg-white px-5 pt-6 pb-2.5 shadow-default">
        <h4 className="mb-6 text-2xl font-semibold text-black">Daftar Barang</h4>
        <div className="">
          <input
            className="border border-slate-600 w-1/4 px-8 py-2 rounded-md"
            placeholder="search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            ref={searchInputRef}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex rounded-sm bg-gray-2 border-b-2 pt-3 pb-1">
            {/* Header columns */}
            <div className="py-2 w-1/3 ">
              <h5 className="text-sm font-bold uppercase text-sky-950">nama_barang</h5>
            </div>
            <div className="py-2 w-1/6">
              <h5 className="text-sm font-bold uppercase text-sky-950">Jumlah</h5>
            </div>
            <div className="py-2 w-1/6">
              <h5 className="text-sm font-bold uppercase text-sky-950">Harga</h5>
            </div>
            <div className="py-2 w-1/6">
              <h5 className="text-sm font-bold uppercase text-sky-950">Stok</h5>
            </div>
            <div className="py-2 w-1/4">
              <h5 className="text-sm font-bold uppercase text-sky-950"></h5>
            </div>
          </div>
          <div className="overflow-scroll max-h-[55vh]">
            {currentItems.map((order, index) => (
              <div key={index} className="flex border-b border-stroke items-center">
                {/* Rows */}
                <div className="py-2 w-1/3">
                  <h5 className="text-sm font-normal uppercase pr-2">{order.nama_barang}</h5>
                </div>
                <div className="py-2 w-1/6">
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    defaultValue={0}
                    className={`w-1/2  text-center border-sky-900 border rounded-md text-sky-950 pl-4 py-1`}
                    onChange={(e) => setSelectedQuantity(parseFloat(e.target.value))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBuy(index);
                        e.target.blur();
                        searchInputRef.current.focus();
                      }
                    }}
                    tabIndex="-1"
                  />
                </div>
                <div className="py-2 w-1/6">
                  <h5 className="harga text-sm font-normal ">Rp {order.jual}</h5>
                </div>
                <div className="py-2 w-1/6">
                  <h5 className="text-sm font-normal ">{order.stok}</h5>
                </div>
                <div className="py-2 w-1/4">
                  <div className="text-sm font-normal cursor-pointer xsm:text-base px-4">
                    <button
                      className="border w-full  text-sky-950 font-semibold border-sky-950 rounded-md px-4 py-2"
                      onClick={() => handleClick(index)}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex font-bold">
          {/* Pagination buttons */}
          <div className="flex  mt-2">
            <button
              className="mx-1 px-3 py-1 rounded-md bg-white hover:bg-gray-200"
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              &#8249;
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`mx-1 px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-gray-300' : 'bg-white hover:bg-gray-200'
                  }`}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              className="mx-1 px-3 py-1 rounded-md bg-white hover:bg-gray-200"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>
      <div className="mb-4 w-2/5 bg-white border px-5 py-6 rounded-md  h-min">
        <h4 className="mb-2 text-lg font-semibold text-gray-400">Keranjang Belanja</h4>
        <div className="flex justify-between pt-3">
          <h4 className="mb-2 text-2xl font-semibold text-black">Total Belanja</h4>
          <h4 className="mb-2 text-2xl font-semibold text-black">
            Rp {totalBelanja}
          </h4>
        </div>
        <div className="overflow-scroll max-h-[58vh] py-4 px-2">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Keranjang belanja kosong.</p>
          ) : (
            <div className='flex flex-col gap-y-3'>
              {cartItems.map((item, index) => (
                <div className="flex">
                  <div className="flex w-5/6 border border-black/30  px-4 py-2 rounde-sm justify-between">
                    <div key={index} className=' uppercase'>
                      {`${item.nama_barang}`}
                    </div>
                    <div className="cart-jml">
                      {item.jumlah}@{item.harga}
                    </div>
                  </div>
                  <div className="text-end w-1/6 flex cart-remove"><button onClick={() => { handleRemoveCartItem(index) }} className='px-4 py-2 border  border-red-600 text-white  bg-red-400'><ImBin /></button></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-8 flex ">
          <button className={`w-full rounded uppercase px-8 py-2 ${cartItems.length === 0 ? 'bg-slate-200' : 'bg-sky-900'} text-white`} disabled={cartItems.length === 0}
            onClick={handleBayar}
          >
            Bayar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableOrder;
