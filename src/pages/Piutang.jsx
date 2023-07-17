import { useEffect, useState } from "react";
import axios from 'axios';
import { ImBin } from "react-icons/im";
import moment from 'moment';
import 'moment/locale/id';
import { useNavigate } from 'react-router-dom';

const Piutang = () => {
    const [notes, setNotes] = useState([]);
    const [expandedNoteIds, setExpandedNoteIds] = useState([]);
    moment.locale('id');
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get("http://localhost:8080/data/notes");
                console.log(response.data);
                setNotes(response.data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const handleToggleNote = (index) => {
        setExpandedNoteIds((prevExpandedNoteIds) => {
            if (prevExpandedNoteIds.includes(index)) {
                return prevExpandedNoteIds.filter((id) => id !== index);
            } else {
                return [...prevExpandedNoteIds, index];
            }
        });
    };

    const handleDelete = async (i) => {
        let noteId = notes[i].notes_id;
        console.log(noteId);

        try {
            const response = await axios.delete(`http://localhost:8080/data/notes/${noteId}`);

            if (response.status === 200) {
                setNotes(prevNotes => {
                    const updatedNotes = [...prevNotes];
                    updatedNotes.splice(i, 1);
                    return updatedNotes;
                });
                console.log("Data deleted successfully.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleTambahClick = () => {
        navigate("/addNote");
    };

    return (
        <div className="Piutang">
            <div className="">
                <div className="font-bold text-3xl pb-8">Catatan</div>
                <button className="text-white  bg-sky-900 py-2 px-4 rounded font-bold mb-4" onClick={handleTambahClick}>
                    Tambah
                </button>
                {notes.length === 0 ? (
                    <div className="text-gray-500 text-lg">Tidak ada catatan.</div>
                ) : (
                    <div className="flex-wrap w-full gap-y-8 gap-x-4 flex">
                        {notes.map((note, index) => {
                            const formattedDate = moment(note.updatedAt).format('DD-MM-YYYY');

                            const colors = ['bg-red-50', 'bg-yellow-50', 'bg-green-50', 'bg-blue-50'];
                            const randomColor = colors[Math.floor(Math.random() * colors.length)];

                            const isNoteExpanded = expandedNoteIds.includes(index);

                            const isNoteLong = note.catatan.length > 50;
                            const truncatedNote = isNoteExpanded ? note.catatan : !isNoteLong ? note.catatan : note.catatan.slice(0, 60) + '...';

                            return (
                                <div className={`rounded border ${randomColor} ${!isNoteExpanded ? isNoteLong ? "h-[21vh]" : "h-[18vh]" : 'h-min'} w-[24%] border rounded`} key={note.id}>
                                    <div className="flex justify-between px-4 py-4 items-center border-b">
                                        <div className="font-bold text-lg text-sky-900">{note.judul}</div>
                                        <div onClick={() => handleDelete(index)} className="text-red-500 cursor-pointer">
                                            <ImBin size={20} />
                                        </div>
                                    </div>
                                    <div className="px-4 pb-3 pt-2">
                                        <div className="font-bold text-sky-900">{formattedDate}</div>
                                        <div className="text-sky-900/90 ">
                                            <p className="whitespace-pre-wrap">{truncatedNote}</p>
                                            <div className="">
                                                <button className="text-sky-900 font-bold" onClick={() => handleToggleNote(index)}>
                                                    {isNoteExpanded ? 'Tutup' : isNoteLong ? 'selengkapnya' : ''}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Piutang;
