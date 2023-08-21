import React from 'react'

export default function MenuItem(props) {
  return (
    <div className='w-100 m-2 border rounded-2'
    style={{backgroundColor: `#FAF3F0`}}>
        <img src= {props.img} alt="img-menu"
            className='w-100 img-fluid rounded-4'
            style={{height: `300px`}}/>

        <div className='w-100 mt-2 p-2'>
            <h5 className='text-info mb-1'>
                {props.nama_menu}
            </h5>
            <h6 className='fw-normal  mb-1'>
                {props.jenis}
            </h6>
            <p>
                {props.deskripsi}
            </p>
            <h5 className='text-info'>
                Rp {props.harga}
            </h5>
        </div>
        <div className='w-100 p-2'>
            <button className='btn btn-primary mx-1'
            onClick={() => props.onEdit()}>
                Edit
            </button>
            <button
            className='btn btn-danger btn primary mx-1'
            onClick={() => props.onDelete()}>
                Delete
            </button>
        </div>
    </div>
  )
}
