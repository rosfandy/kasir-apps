import React, { useEffect } from 'react';

const ConfirmAlert = ({ onConfirmation, isAlert }) => {
    const handleConfirmation = (confirmation) => {
        onConfirmation(confirmation);
        isAlert(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onConfirmation(true);
                isAlert(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="modal flex items-center justify-center fixed top-0 left-0 w-full z-50    h-screen bg-black/50">
            <div className="modal-content bg-white px-8 py-4 rounded">
                <h2 className=' font-bold'>Confirmation</h2>
                <p>Are you sure you want to proceed?</p>
                <div className="modal-buttons mt-4 flex justify-end">
                    <div className="flex gap-x-2">
                        <button className='bg-sky-900 text-white px-4 py-1 rounded' onClick={() => handleConfirmation(true)}>Yes</button>
                        <button className='bg-red-500 text-white px-4 py-1 rounded' onClick={() => handleConfirmation(false)}>No</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAlert;
