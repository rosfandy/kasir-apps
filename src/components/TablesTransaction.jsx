import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BiSolidReport } from "react-icons/bi";


const Tables = ({ orders, loading }) => {
  const navigate = useNavigate()
  const [data, setOrders] = useState([])
  useEffect(() => {
    setOrders(data)
  }, [])
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
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

  const handleDetail = (index) => {
    const orderId = document.querySelectorAll('.order-id');
    console.log(orderId[index].innerHTML);
    localStorage.setItem("order-id", orderId[index].innerHTML)
    navigate("/detailorder")
  }

  return (
    <div className="mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
        <div className="flex justify-between">
          <div className="">
            <h4 className="mb-6 text-2xl font-semibold text-black ">
              Daftar Transaksi
            </h4>
          </div>
          <div className=""><button onClick={() => navigate("/report")} className='bg-sky-900 px-8 py-2 text-lg text-white rounded flex items-center gap-x-2 justify-center' type="button">Report <BiSolidReport size={20} /></button></div>
        </div>
        <div className="flex flex-col">
          <div className="flex rounded-sm bg-gray-2 border-b-2">
            <div className="p-2.5 xl:p-5 w-1/12">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                No
              </h5>
            </div>
            <div className="p-2.5 xl:p-5 w-1/6   ">
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
            <div className="hidden p-2.5 sm:block xl:p-5 w-1/4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Tanggal
              </h5>
            </div>
            <div className="hidden p-2.5 sm:block xl:p-5 w-1/3">
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
              orders.map((order, index) => (
                <div key={index} className="flex border-b border-stroke items-center">
                  <div className="p-2.5 xl:p-5 w-1/12">
                    <h5 className="text-md font-normal xsm:text-base">{index + 1}</h5>
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
                    <h5 className="text-md font-normal xsm:text-base">Rp {order.untung}</h5>
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
    </div>
  );
};

export default Tables;
