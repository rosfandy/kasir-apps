import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const TableProduct = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedData, setEditedData] = useState(orders.map(order => ({ ...order })));

  const itemsPerPage = 50;
  const pageRangeDisplayed = 5;
  const searchInputRef = useRef(null);
  const inputRefs = useRef([]);

  useEffect(() => {
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
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
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
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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
    setCurrentPage(1); // Reset current page when search term changes
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleFieldEdit = (e, index, field) => {
    const value = e.target.value;

    // Update the edited data for the specific order field
    const updatedData = [...editedData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setEditedData(updatedData);

    // Update nilai-nilai dalam orders
    const updatedOrders = [...filteredOrders];
    updatedOrders[index][field] = value;
    setOrders(updatedOrders);

    if (e.key === 'Enter') {
      e.target.blur();
    }

  };

  const handleDoneEdit = (index) => {
    setEditingIndex(-1);
    // Retrieve the kode_barang from the original order
    const editedOrder = editedData[index];
    const originalOrder = orders[index];


    // Get the edited data for the specific order
    console.log(originalOrder)


    // Send the updated data to the server
    axios
      .post(`http://localhost:8080/data/product/${originalOrder.kode_barang}`, originalOrder)
      .then((response) => {
        console.log('Updated data:', response.data);
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };


  const handleDelete = (index) => {
    const order = filteredOrders[index];
    console.log(order.kode_barang);

    confirmAlert({
      title: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin menghapus data ini?',
      buttons: [
        {
          label: 'Ya',
          onClick: async () => {
            try {
              // Send the delete request to the server
              await axios.delete(`http://localhost:8080/data/product/${order.kode_barang}`);
              console.log('Data deleted successfully.');
              // Remove the deleted order from the state
              const updatedOrders = [...filteredOrders];
              setOrders(updatedOrders);

              window.location.reload()
            } catch (error) {
              console.error('Error deleting data:', error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
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
          <div className="flex rounded-sm bg-gray-2  border-b-2">
            <div className=" py-5 w-1/4 ">
              <h5 className="text-sm font-medium uppercase xsm:text-base">ID Barang</h5>
            </div>
            <div className=" py-5 w-1/4 ">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Nama Barang</h5>
            </div>
            <div className=" py-5 w-1/6 ">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Stok</h5>
            </div>
            <div className="  py-5 w-1/4 ">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Kategori</h5>
            </div>
            <div className="  py-5 w-1/6 ">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Jual</h5>
            </div>
            <div className="  py-5 w-1/6 ">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Beli</h5>
            </div>
            <div className="  py-5 w-1/4 ">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Diubah</h5>
            </div>
            <div className="  py-5 w-1/4 ">
              <h5 className="text-sm font-medium uppercase xsm:text-base"></h5>
            </div>
          </div>
          <div className="overflow-scroll max-h-[50vh]">
            {currentItems.map((order, index) => (
              <div key={index} className={`flex border-b border-stroke items-center ${editingIndex === index ? 'bg-green-50' : ''}`}>
                <div className="py-2 w-1/4 ">
                  <h5 className="text-sm font-normal ">{order.kode_barang}</h5>
                </div>
                <div className="py-2 w-1/4">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className='w-[75%] text-center border rounded border-sky-950 bg-transparent'
                      value={order.nama_barang}
                      onChange={(e) => handleFieldEdit(e, index, 'nama_barang')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleFieldEdit(e, index, 'nama_barang');
                        }
                      }}
                    />
                  ) : (
                    <h5 className="text-sm font-normal pr-2">{order.nama_barang}</h5>
                  )}
                </div>
                <div className="py-2 w-1/6">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className='w-1/2 border rounded border-sky-950 text-center bg-transparent'
                      value={order.stok}
                      onChange={(e) => handleFieldEdit(e, index, 'stok')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleFieldEdit(e, index, 'stok');
                        }
                      }}
                    />
                  ) : (
                    <h5 className="text-sm font-normal ">{order.stok}</h5>
                  )}
                </div>
                <div className="py-2 w-1/4">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className='w-1/2 text-center border rounded border-sky-950 bg-transparent'
                      value={order.kategori}
                      onChange={(e) => handleFieldEdit(e, index, 'kategori')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleFieldEdit(e, index, 'kategori');
                        }
                      }}
                    />
                  ) : (
                    <h5 className="text-sm font-normal ">{order.kategori}</h5>
                  )}
                </div>
                <div className="py-2 w-1/6">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className='w-1/2 text-center border rounded border-sky-950 bg-transparent'
                      value={order.jual}
                      onChange={(e) => handleFieldEdit(e, index, 'jual')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleFieldEdit(e, index, 'jual');
                        }
                      }}
                    />
                  ) : (
                    <h5 className="text-sm font-normal ">Rp {order.jual}</h5>
                  )}
                </div>
                <div className="py-2 w-1/6">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className='w-1/2 text-center border rounded border-sky-950 bg-transparent'
                      value={order.beli}
                      onChange={(e) => handleFieldEdit(e, index, 'beli')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleFieldEdit(e, index, 'beli');
                        }
                      }}
                    />
                  ) : (
                    <h5 className="text-sm font-normal ">Rp {order.beli}</h5>
                  )}
                </div>
                <div className="py-2 w-1/4">
                  <h5 className="text-sm font-normal ">
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
                <div className="py-2 w-1/4 flex gap-x-4 items-center">
                  {editingIndex === index ? (
                    <div className="text-sm font-normal cursor-pointer xsm:text-base w-1/3 text-center">
                      <button
                        className="border bg-sky-950 text-white rounded-md px-4 py-2"
                        onClick={() => handleDoneEdit(index)}
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className={`action flex gap-x-4 text-sm font-normal cursor-pointer xsm:text-base w-1/3 text-center ${editingIndex !== -1 ? 'hidden' : ''}`}>
                      <button
                        className="border border-sky-950 text-sky-950 rounded-md px-4 py-2"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      <div className="text-sm font-normal cursor-pointer xsm:text-base w-1/4 text-center">
                        <button className="bg-red-500 rounded-md text-white px-4 py-2" onClick={() => handleDelete(index)}>Hapus</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex  mt-4">
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
  );
};

export default TableProduct;
