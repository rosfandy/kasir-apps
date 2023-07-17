import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PiReceiptBold } from 'react-icons/pi';
import { RxDashboard } from 'react-icons/rx';
import { BiFoodMenu } from 'react-icons/bi';
import { TbCoins } from 'react-icons/tb';
import { HiOutlineBanknotes } from 'react-icons/hi2';

export default function Sidebar() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };
  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  // Fungsi untuk memeriksa apakah rute saat ini cocok dengan rute menu yang sedang diperiksa
  const isMenuActive = (menuRoute) => {
    return location.pathname === menuRoute;
  };

  const handleShortcutNavigation = (event) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case '1':
          handleNavigate('/order');
          break;
        case '2':
          handleNavigate('/');
          break;
        case '3':
          handleNavigate('/product');
          break;
        case '4':
          handleNavigate('/point');
          break;
        case '5':
          handleNavigate('/piutang');
          break;
        default:
          break;
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleShortcutNavigation);
    return () => {
      document.removeEventListener('keydown', handleShortcutNavigation);
    };
  }, []);

  return (
    <div className="Sidebar fixed gap-y-4 flex flex-col pt-[5%] left-[3%]">
      <Link
        to="/order"
        className={`menu shadow border border-2 shadow-black/5 rounded-md items-center flex flex-col gap-y-4 justify-center cursor-pointer  py-5 px-2 ${isMenuActive('/order') ? 'bg-[#003049] text-white duration-75' : 'bg-white'
          }`}
        onClick={() => handleMenuClick('New Order')}
      >
        <PiReceiptBold size={24} />
        <div className="font-bold">New Order</div>
      </Link>
      <Link
        to="/"
        className={`menu shadow border border-2 shadow-black/5 rounded-md items-center flex flex-col gap-y-4 justify-center cursor-pointer py-5 px-2 ${isMenuActive('/') ? 'bg-[#003049] text-white duration-75' : 'bg-white'
          }`}
        onClick={() => handleMenuClick('Dashboard')}
      >
        <RxDashboard size={24} />
        <div className="font-bold">Dashboard</div>
      </Link>
      <Link
        to="/product"
        className={`menu shadow border border-2 shadow-black/5 rounded-md items-center flex flex-col gap-y-4 justify-center cursor-pointer  py-5 px-2 ${isMenuActive('/product') ? 'bg-[#003049] text-white duration-75' : 'bg-white'
          }`}
        onClick={() => handleMenuClick('Product')}
      >
        <BiFoodMenu size={24} />
        <div className="font-bold">Product</div>
      </Link>
      <Link
        to="/point"
        className={`menu shadow border border-2 shadow-black/5 rounded-md items-center flex flex-col gap-y-4 justify-center cursor-pointer  py-5 px-2 ${isMenuActive('/point') ? 'bg-[#003049] text-white duration-75' : 'bg-white'
          }`}
        onClick={() => handleMenuClick('Point Pelanggan')}
      >
        <TbCoins size={24} />
        <div className="font-bold">Point Pelanggan</div>
      </Link>
      <Link
        to="/piutang"
        className={`menu shadow border border-2 shadow-black/5 rounded-md items-center flex flex-col gap-y-4 justify-center cursor-pointer  py-5 px-2 ${isMenuActive('/piutang') ? 'bg-[#003049] text-white duration-75' : 'bg-white'
          }`}
        onClick={() => handleMenuClick('Piutang')}
      >
        <HiOutlineBanknotes size={24} />
        <div className="font-bold">Catatan</div>
      </Link>
    </div>
  );
}
