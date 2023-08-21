import React, { useState, useEffect } from "react"
import axios from "axios";
import { Modal } from "bootstrap";

const baseURL = 'http://localhost:8000'
const header = {
    headers: {
        Authorization:
            `Bearer ${localStorage.getItem('token')}`,
    }
};

const Transaksi = () => {
    const [transaksi, setTransaksi] = useState([]);
    const [menu, setMenu] = useState([]);
    const [meja, setMeja] = useState([]);

    /** grab data logged user from local storage */
    const USER = JSON.parse(localStorage.getItem("user"));

    const [id_user, setIdUser] = useState(USER.id_user);

    const [tgl_transaksi, setTglTransaksi] = useState("");

    const [nama_pelanggan, setNamaPelanggan] = useState("");

    const [id_meja, setIdMeja] = useState("");

    const [detail_transaksi, setDetailTransaksi] = useState([]);

    /** each detail contain id_menu dan jumlah */
    const [id_menu, setIdMenu] = useState("");
    const [jumlah, setJumlah] = useState(0);

    const [modal, setModal] = useState(null);

    /** ini akhir state  */
    /** method for get all menu */
    const getMenu = () => {
        const url = `${baseURL}/menu`;
        axios
            .get(url, header)
            .then((response) => {
                setMenu(response.data.data);
            })
            .catch((error) => console.log(error));
    };

    /** method for get all meja */
    const getMeja = () => {
        const url = `${baseURL}/meja/available`;
        axios
            .get(url, header)
            .then((response) => {
                setMeja(response.data.data);
            })
            .catch((error) => console.log(error));
    };
    /** method for get all transaksi  */
    const getTransaksi = () => {
        const url = `${baseURL}/transaksi`
        axios
            .get(url, header)
            .then(response => {
                setTransaksi(response.data.data)
            })
            .catch(error => console.log(error))
    };
    const addMenu = () => {
        // set selected
        let selectedMenu = menu.find((item) => item.id_menu == id_menu);

        let newItem = {
            ...selectedMenu,
            jumlah: jumlah,
        };
        let tempDetail = [...detail_transaksi];
        // insert new item to cart
        tempDetail.push(newItem);

        //update data cart
        setDetailTransaksi(tempDetail);

        //reset option menu dan jumlah
        setIdMenu("");
        setJumlah(0);
    }
    const handleSaveTransaksi = event => {
        event.preventDefault()
        if (nama_pelanggan === "" ||
            id_meja === "" ||
            tgl_transaksi === "" ||
            detail_transaksi == 0) {
            window.alert('Please complete the form')
        } else {
            const url = `${baseURL}/transaksi`
            const payload = {
                tgl_transaksi, id_meja,
                id_user, nama_pelanggan,
                detail_transaksi
            }

            axios.post(url, payload, header)
                .then(response => {
                    /** show message */
                    window.alert(`Data Transaksi berhasil ditambahkan`)

                    /** close the modal */
                    modal.hide()

                    /** reset data inside form */
                    setTglTransaksi("")
                    setIdMeja("")
                    setIdMenu("")
                    setJumlah(0)
                    setNamaPelanggan("")
                    setDetailTransaksi([])

                    /** recall get transaksi */
                    getTransaksi()

                    /** recall available meja */
                    getMeja()
                })
                .catch(error => console.log(error))

        }
    }

    const handleDelete = item => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus data ini?`)) {
            const url = `${baseURL}/transaksi/${item.id_transaksi}`
            axios.delete(url, header)
                .then(response => getTransaksi())
                .catch(error => console.log(error))
        }
    }

    const deleteMenu = index => {
        let tamp = [...detail_transaksi]
        tamp.splice(index, 1)
        setDetailTransaksi(tamp)
    }

    const handlePay = item => {
        if (window.confirm(`Apakah Anda yakin ingin membayar?`)) {
            const url = `${baseURL}/transaksi/${item.id_transaksi}`
            const payload = {
                ...item, status: "lunas"
            }
            axios.put(url, payload, header)
                .then(response => getTransaksi())
                .catch(error => console.log(error))
        }

    }


    useEffect(() => {
        getTransaksi()
        getMenu()
        getMeja()

        /** register modal */
        setModal(new Modal(`#modal-transaksi`));
    }, [])

    return (
        <div className="w-100"
            style={{
                backgroundColor: '#FFD9C0'
            }}>
            <h3> Data Transaksi </h3>
            <button className="btn m-1" onClick={() => modal.show()}
                style={{
                    backgroundColor: '#FCBAAD'
                }}>
                Transaksi Baru
            </button>
            <ul className="list-group">
                {transaksi.map((item, index) => (
                    <li className="list-group-item" key={`tran${index}`}>
                        <div className="row">
                            <div className="col-md-2">
                                <small className="text-info"> Tg.Transaksi </small> <br />
                                {item.tgl_transaksi}
                            </div>
                            <div className="col-md-3">
                                <small className="text-info"> Nama Pelanggan </small> <br />
                                {item.nama_pelanggan}
                            </div>
                            <div className="col-md-2">
                                <small className="text-info"> No.Meja </small> <br />
                                {item.meja.nomor_meja}
                            </div>
                            <div className="col-md-2">
                                <small className="text-info"> Status </small> <br />
                                <span className={`badge ${item.status === 'belum_bayar' ? 'bg-danger' : 'bg-success'}`}>
                                    {item.status}
                                </span>
                                <br />
                                {item.status === 'belum_bayar' ?
                                    <>
                                        <button className="btn btn-sm btn-info"
                                            onClick={() => handlePay(item)}>
                                            PAY
                                        </button>
                                    </>
                                    :
                                    <></>}
                            </div>

                            <div className="col-md-2">
                                <small className="text-info">
                                    Total
                                </small> <br />
                                {
                                    item
                                        .detail_transaksi
                                        .reduce((sum, obj) =>
                                            Number(sum) + (obj["jumlah"] * obj["harga"]), 0)
                                }
                            </div>

                            <div className="col-md-1">
                                <small className="text-info">
                                    Action
                                </small> <br />
                                <button className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(item)}>
                                    &times;
                                </button>
                            </div>

                        </div>
                        {/** list menu yg dipesan */}
                        <div className="row">
                            <h5 className="ms-1"> Detail Pesanan </h5>
                            <ul className="list-group">
                                {item.detail_transaksi.map((detail) => (
                                    <li
                                        className="list-group-item"
                                        key={`detail${item.id_transaksi}`}
                                    >
                                        <div className="row">
                                            {/** nama pesanan */}
                                            <div className="col-md-3">
                                                <small className="text-success"> Menu </small> <br />
                                                {detail.menu.nama_menu}
                                            </div>
                                            {/** jumlah pesanan */}
                                            <div className="col-md-3">
                                                <small className="text-success"> Jumlah </small> <br />
                                                Qty: {detail.jumlah}
                                            </div>
                                            {/** harga satuan */}
                                            <div className="col-md-3">
                                                <small className="text-success"> Harga </small> <br /> @
                                                {detail.harga}
                                            </div>
                                            {/** total */}
                                            <div className="col-md-3">
                                                <small className="text-success"> Total </small> <br />
                                                Rp {Number(detail.harga) * Number(detail.jumlah)}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
            {/** modal for form add transaksi */}
            <div className="modal fade"
                id="modal-transaksi">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSaveTransaksi}>
                            <div className="modal-header">
                                <h4 className="modal-title"> Form Transaksi </h4>
                                <small> Tambahkan pesanan anda </small>
                            </div>
                            <div className="modal-body">
                                {/** fill customer area */}
                                <div className="row">
                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Nama Pelanggan
                                        </small>
                                        <input type="text"
                                            className="form-control mb-2"
                                            value={nama_pelanggan}
                                            onChange={
                                                e => setNamaPelanggan(e.target.value)
                                            } />
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Pilih Meja
                                        </small>
                                        <select
                                            className="form-control mb-2"
                                            value={id_meja}
                                            onChange={e => setIdMeja(e.target.value)}>
                                            <option value="">--Pilih Meja</option>
                                            {meja.map(table => (
                                                <option value={table.id_meja}
                                                    key={`keyMeja${table.id_meja}`}>

                                                    Nomor Meja {table.nomor_meja}
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Tgl. Transaksi
                                        </small>
                                        <input type="date"
                                            className="form-control mb-2"
                                            value={tgl_transaksi}
                                            onChange={
                                                e => setTglTransaksi(e.target.value)
                                            } />
                                    </div>
                                </div>

                                {/** choose menu area */}
                                <div className="row">
                                    <div className="col-md-8">
                                        <small className="text-info"> Pilih Menu </small>
                                        <select
                                            className="form-control mb-2"
                                            value={id_menu}
                                            onChange={(e) => setIdMenu(e.target.value)}
                                        >
                                            <option value=""> Pilih Menu </option>
                                            {menu.map((item, index) => (
                                                <option value={item.id_menu} key={`keyMenu${index}`}>
                                                    {item.nama_menu}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <small className="text-info"> Jumlah </small>
                                        <input
                                            type="number"
                                            className="form-control mb-2"
                                            value={jumlah}
                                            onChange={(e) => setJumlah(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <small className="text-info"> Action </small> <br />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            onClick={() => addMenu()}
                                        >
                                            ADD
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <h5 className="ms-1"> Detail Pesanan </h5>
                                    <ul className="list-group">
                                        {detail_transaksi.map((detail) => (
                                            <li
                                                className="list-group-item"
                                                key={`detail${detail.id_menu}`}>
                                                <div className="row">
                                                    {/** nama pesanan */}
                                                    <div className="col-md-3">
                                                        <small className="text-success"> Menu </small>
                                                        <br /> {detail.nama_menu}
                                                    </div>
                                                    {/** jumlah pesanan */}
                                                    <div className="col-md-3">
                                                        <small className="text-success"> Jumlah </small>
                                                        <br />
                                                        Qty: {detail.jumlah}
                                                    </div>
                                                    {/** harga satuan */}
                                                    <div className="col-md-3">
                                                        <small className="text-success"> Harga </small>
                                                        <br /> @ {detail.harga}
                                                    </div>
                                                    {/** total */}
                                                    <div className="col-md-3">
                                                        <small className="text-success"> Total </small>
                                                        <br />
                                                        Rp {Number(detail.harga) *
                                                            Number(detail.jumlah)}
                                                    </div>
                                                    <div className="col-md-1">
                                                        <small className="text-info">
                                                            Action
                                                        </small> <br />
                                                        <button className="btn btn-sm btn-danger"
                                                            type="button"
                                                            onClick={() => deleteMenu(detail)}>
                                                            &times;
                                                        </button>


                                                    </div>
 

                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button type="submit"
                                    className="w-100 btn btn-success my-2">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Transaksi;