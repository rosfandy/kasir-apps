import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const TablePoint = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedData, setEditedData] = useState(orders.map((order) => ({ ...order })));

  const itemsPerPage = 50;
  const pageRangeDisplayed = 5;
  const searchInputRef = useRef(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/data/point');
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
    order.nama_pembeli.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEditingIndex(-1); // Reset editing index when changing page
    setEditedData(orders.map((order) => ({ ...order }))); // Reset edited data when changing page
    const newIndexOfFirstItem = indexOfLastItem; // Calculate new index of the first item in the new page
    const newIndexOfLastItem = newIndexOfFirstItem + itemsPerPage; // Calculate new index of the last item in the new page
    inputRefs.current = []; // Reset input refs when changing page
    setSearchTerm(''); // Reset search term when changing page
    setCurrentPage(newIndexOfFirstItem, newIndexOfLastItem); // Update the values of indexOfFirstItem and indexOfLastItem
  };


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset current page when search term changes
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    console.log(index)
  };

  const handleFieldEdit = (e, index, field) => {
    const value = e.target.value;
    console.log(value)
    // Update the edited data for the specific order field
    const updatedData = [...editedData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setEditedData(updatedData);
    console.log("up: ", updatedData)
    // Update the values in orders
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
    console.log(originalOrder);

    // Send the updated data to the server
    axios
      .post(`http://localhost:8080/data/point/${originalOrder.id_pembeli}`, originalOrder)
      .then((response) => {
        console.log('Updated data:', response.data);
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };

  const handleDelete = (index) => {
    const actualIndex = indexOfFirstItem + index;
    const order = filteredOrders[actualIndex];
    console.log(order.id_pembeli);

    confirmAlert({
      title: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin menghapus data ini?',
      buttons: [
        {
          label: 'Ya',
          onClick: async () => {
            try {
              // Send the delete request to the server
              await axios.delete(`http://localhost:8080/data/point/${order.id_pembeli}`);
              console.log('Data deleted successfully.');
              // Remove the deleted order from the state
              const updatedOrders = [...filteredOrders];
              updatedOrders.splice(actualIndex, 1);
              setOrders(updatedOrders);
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
        <h4 className="mb-6 text-2xl font-semibold text-black">Daftar Pelanggan</h4>
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
          <div className="flex rounded-sm bg-gray-2 border-b-2">
            <div className=" py-5 w-[8.5%] ">
              <h5 className="text-sm font-medium uppercase xsm:text-base">No</h5>
            </div>
            <div className=" py-5 w-1/5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">ID Pembeli</h5>
            </div>
            <div className=" py-5 w-[18%]">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Nama Pembeli</h5>
            </div>
            <div className=" py-5 w-[10%] px-8">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Point</h5>
            </div>
            <div className="  py-5 w-[24%]">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Alamat</h5>
            </div>
            <div className="  py-5 w-1/4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Diubah</h5>
            </div>
            <div className="  py-5 w-1/3">
              <h5 className="text-sm font-medium uppercase xsm:text-base"></h5>
            </div>
          </div>
          <div className="overflow-scroll max-h-[50vh]">
            {currentItems.map((order, index) => {
              const actualIndex = indexOfFirstItem + index;
              return (
                <div key={index} className={`flex border-b border-stroke items-center ${editingIndex === actualIndex ? 'bg-green-50' : ''}`}>
                  <div className="py-2 w-1/12">
                    <h5 className="text-sm font-normal ">{actualIndex + 1}</h5>
                  </div>
                  <div className="py-2 w-1/5 ">
                    <h5 className="text-sm font-normal ">{order.id_pembeli}</h5>
                  </div>
                  <div className="py-2 w-1/5 ">
                    {editingIndex === actualIndex ? (
                      <input
                        type="text"
                        className="w-1/2 bg-transparent border rounded border-sky-950 text-center"
                        value={order.nama_pembeli}
                        onChange={(e) => handleFieldEdit(e, actualIndex, 'nama_pembeli')}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleFieldEdit(e, actualIndex, 'nama_pembeli');
                          }
                        }}
                      />
                    ) : (
                      <h5 className="text-sm font-normal ">{order.nama_pembeli}</h5>
                    )}
                  </div>
                  <div className="py-2 w-[10%] px-8">
                    {editingIndex === actualIndex ? (
                      <input
                        type="text"
                        className="w-full bg-transparent border rounded border-sky-950 text-center"
                        value={order.total_point}
                        onChange={(e) => handleFieldEdit(e, actualIndex, 'total_point')}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleFieldEdit(e, actualIndex, 'total_point');
                          }
                        }}
                      />
                    ) : (
                      <h5 className="text-sm font-normal ">{order.total_point}</h5>
                    )}
                  </div>
                  <div className="py-2 w-[24%]">
                    {editingIndex === actualIndex ? (
                      <input
                        type="text"
                        className="w-[75%] bg-transparent border rounded border-sky-950 text-center"
                        value={order.alamat}
                        onChange={(e) => handleFieldEdit(e, actualIndex, 'alamat')}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleFieldEdit(e, actualIndex, 'alamat');
                          }
                        }}
                      />
                    ) : (
                      <h5 className="text-sm font-normal ">{order.alamat}</h5>
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
                  <div className="py-2 w-1/3 flex gap-x-4 items-center">
                    {editingIndex === actualIndex ? (
                      <div className="text-sm font-normal cursor-pointer xsm:text-base w-1/3 text-center">
                        <button
                          className="border border-sky-950 text-sky-950 rounded-md px-4 py-2"
                          onClick={() => handleDoneEdit(actualIndex)}
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <div className={`action flex gap-x-4 text-sm font-normal cursor-pointer xsm:text-base w-1/3 text-center ${editingIndex !== -1 ? 'hidden' : ''}`}>
                        <button
                          className="border border-sky-950 text-sky-950 rounded-md px-4 py-2"
                          onClick={() => handleEdit(actualIndex)}
                        >
                          Edit
                        </button>
                        <div className="text-sm font-normal cursor-pointer xsm:text-base w-1/3 text-center">
                          <button className="bg-red-500 rounded-md text-white px-4 py-2" onClick={() => handleDelete(actualIndex)}>Hapus</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

export default TablePoint;
