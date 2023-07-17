import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddNote = () => {
    const [judul, setJudul] = useState("");
    const [catatan, setCatatan] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/data/notes", {
                judul,
                catatan,
            });

            console.log(response.data);
            navigate("/piutang"); // Navigate back to the Piutang component or any other desired route
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center min-h-[65vh]">
                <div className="w-1/2 ">
                    <form className="bg-white shadow border py-4 px-8" onSubmit={handleSubmit}>
                        <div className="font-bold text-3xl pb-8 text-center">Tambah Catatan</div>

                        <div className="flex flex-col">
                            <label className=" font-bold">Judul:</label>
                            <input className="border-black/50 px-4 py-2 border" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold ">Catatan:</label>
                            <textarea className="border px-4 py-2 border-black/50" value={catatan} onChange={(e) => setCatatan(e.target.value)} required></textarea>
                        </div>
                        <button type="submit" className="bg-sky-900 text-white mt-4 py-2 px-4 w-full rounded mb-8">Tambah</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddNote;
