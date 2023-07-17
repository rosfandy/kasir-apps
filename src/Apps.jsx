import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Point from './pages/Point';
import Product from './pages/Product';
import Order from './pages/Order';
import Piutang from './pages/Piutang';
import Invoice from './pages/Invoice';
import Print from './pages/Print';
import DetailOrder from './pages/DetailOder';
import AddNote from './pages/AddNote';
import Report from './pages/Report';

function App() {
    return (
        <Router>
            <Sidebar />
            <div className="bg-[#FAFAFA] min-h-screen pl-[16%] pr-[5%] pt-[3%]">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/point" element={<Point />} />
                    <Route path="/piutang" element={<Piutang />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/print" element={<Print />} />
                    <Route path="/detailorder" element={<DetailOrder />} />
                    <Route path="/addNote" element={<AddNote />} />
                    <Route path="/report" element={<Report />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
