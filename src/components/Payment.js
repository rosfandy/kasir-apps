import axios from 'axios';
import { toast } from 'react-toastify';

const handleBayar = (
  inputUang,
  totalBelanja,
  selectedOption,
  setUangKembali,
  setPointBelanja,
  totalUntung,
  setIsValid,
  setIsClose
) => {
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

    let kembalian = parseFloat(inputUangValue - totalBelanja);
    setUangKembali(kembalian);

    let nama = "";
    if (selectedOption === null) {
      nama = "umum";
    } else {
      nama = selectedOption.label;
    }

    const transactionData = {
      untung: totalUntung,
      nama_pembeli: nama,
      total_harga: totalBelanja,
    };

    const poin = Math.floor(totalBelanja / 10000);
    setPointBelanja(poin);

    axios
      .post('http://localhost:8080/data/order', transactionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response);
        toast.success('Terima kasih atas pembayarannya!');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      });
  }
};

export default handleBayar;
