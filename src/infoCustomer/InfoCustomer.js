import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, Outlet } from 'react-router-dom';
import Select from 'react-select';


function InfoCustomer() {

    const { id } = useParams()
    const [data, setData] = useState("")
    const [dataParents, setDataParents] = useState("")

    const [mobile, setMobile] = useState("")
    const [name, setName] = useState("")
    const [note, setNote] = useState("")
    const [parentID, setParentID] = useState("")
    const [pricePerBigPackage, setPricePerBigPackage] = useState("")
    const [pricePerKg, setPricePerKg] = useState("")
    const [pricePerPackage, setPricePerPackage] = useState("")
    const [pricePerPercent, setPricePerPercente] = useState("")
    const [transferFrom, setTransferFrom] = useState("")
    const [transferTo, setTransferTo] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/khachhangs');
                setData(response.data.data);
                setDataParents(response.data.parents)

                setMobile(response.data.data[id - 1].mobile)
                setName(response.data.data[id - 1].name)
                setNote(response.data.data[id - 1].note)
                setParentID(response.data.data[id - 1].parentID)
                setPricePerBigPackage(response.data.data[id - 1].pricePerBigPackage)
                setPricePerKg(response.data.data[id - 1].pricePerKg)
                setPricePerPackage(response.data.data[id - 1].pricePerPackage)
                setPricePerPercente(response.data.data[id - 1].pricePerPercent)
                setTransferFrom(response.data.data[id - 1].transferFrom)
                setTransferTo(response.data.data[id - 1].transferTo)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [id])

    const upInfoCustomer = async () => {
        try {
            await axios.post(`/api/khachhangs/${id}`,
                {
                    mobile,
                    name,
                    note,
                    parentID,
                    pricePerBigPackage,
                    pricePerKg,
                    pricePerPackage,
                    pricePerPercent,
                    transferFrom,
                    transferTo
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const checkValue = (mobile?.startsWith("03") || mobile?.startsWith("05") || mobile?.startsWith("07")
        || mobile?.startsWith("08") || mobile?.startsWith("09"))
        && mobile?.length === 10 && name && transferFrom && transferTo

    const handleUpInfoCustomer = () => {
        if (checkValue) {
            upInfoCustomer();
        }
    }
    //Kiểm tra dataParents có phải mảng không trước khi render Option
    const parentOptions = Array.isArray(dataParents)
        ? [
            { value: null, label: "-----" },
            ...dataParents.map((item) => ({ value: item.id, label: item.name }))
        ]
        : [];


    //Show/Unshow Btn edit Info
    const [showBtnEdit, setBtnEdit] = useState(false)
    const handleShowInfo = () => {
        setBtnEdit(!showBtnEdit)
    }


    // Show Form Edit Info/ Edit Info

    const [showFormEdit, setShowFormEdit] = useState(false)
    const handleShowFormInfoCustomer = () => {
        setShowFormEdit(!showFormEdit)
    }

    return (
        <>

            <div className="mx-auto mp-5 w-10/12 mt-[20px] max-w-[1124px]">
                <div className='relative'>
                    <p className="text-[26px] flex items-center mb-4">
                        <span>Khách hàng:</span>
                        <span className="text-[22px] font-bold ml-1 text-ellipsis overflow-hidden max-w-[300px] m-0 block">
                            {data[id - 1]?.name}
                        </span>
                        <span className={data[id-1]?.debt < 0 ? "text-[22px] mx-1 text-[red]" :  data[id-1]?.debt > 0 ? "text-[22px] mx-1 text-[green]" : "text-[22px] mx-1" }>
                            ( <span className="text-red">{new Intl.NumberFormat().format(data[id - 1]?.debt)} VNĐ</span> )
                        </span>
                        <button
                            onClick={handleShowInfo}
                            type="button" className="ant-btn css-1km3mtt ant-btn-default border px-4 py-1.5 rounded-md hover:border-cyan-500">
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 512 512"
                                height="16"
                                width="16"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
                            </svg>
                        </button>
                    </p>
                    <div className={showBtnEdit ? 'absolute left-[15%] border h-[maxcontent] w-[400px] pb-2 rounded-md bg-white z-10 ' : 'absolute left-[15%] border h-[maxcontent] w-[400px] pb-2 rounded-md bg-white z-10 hidden'}>
                        <div className='flex justify-around pt-4'>
                            <p className='w-[40%]'>Số điện thoại:</p>
                            <p className='w-[45%] font-medium'>{data[id - 1]?.mobile}</p>
                        </div>
                        <div className='flex justify-around pt-4'>
                            <p className='w-[40%]'>Vận chuyển từ - đến:</p>
                            <p className='w-[45%] font-medium'>{data[id - 1]?.transferFrom} - {data[id - 1]?.transferTo}</p>
                        </div>
                        <div className='flex justify-around pt-4'>
                            <p className='w-[40%]'>Tỉ giá (VNĐ):</p>
                            <p className='w-[45%] font-medium'>
                                <span>{new Intl.NumberFormat().format(data[id - 1]?.pricePerKg)} /Kg</span>
                                <br />
                                <span>{data[id - 1]?.pricePerPackage} /Kiện</span>
                                <br />
                                <span>{data[id - 1]?.pricePerBigPackage} /Kiện lớn</span>
                            </p>
                        </div>
                        <div className='flex justify-around pb-2'>
                            <p className='w-[40%]'>Ghi chú:</p>
                            <p className='w-[45%] font-medium'>{data[id - 1]?.note}</p>
                        </div>
                        <div className=' border-t-2 flex justify-end'>
                            <button onClick={handleShowFormInfoCustomer} className='border px-2 py-1 rounded-md mt-1.5 mr-2 text-white bg-blue-500 hover:bg-blue-700'>Sửa</button>
                        </div>
                    </div>

                    <div className={showFormEdit ? "modal flex fixed top-0 right-0 bottom-0 left-0 z-10" : "hidden modal flex fixed top-0 right-0 bottom-0 left-0 z-10"}>
                        <div className="modalOverlay absolute w-full h-full bg-black/20"></div>
                        <div className="modalBody h-[500px] w-11/12 max-w-[600px] bg-white mx-auto mt-24 z-10">
                            <div className="flex justify-between px-3 py-3">
                                <h1 className="font-medium">Sửa thông tin khách hàng</h1>
                                <button onClick={handleShowFormInfoCustomer}>
                                    <svg viewBox="64 64 896 896" focusable="false" data-icon="close"
                                        width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <form>
                                    <div className="grid grid-cols-[130px_1fr] mt-5">
                                        <div className="flex items-center justify-start ml-4">Đối tác</div>
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            name="name" placeholder="Tên"
                                            className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green"
                                            data-gtm-form-interact-field-id="4">
                                        </input>
                                    </div>
                                    <div className="grid grid-cols-[130px_1fr] mt-5">
                                        <div className="flex items-center justify-start ml-4">Số điện thoại</div>
                                        <input
                                            value={mobile}
                                            onChange={e => setMobile(e.target.value)}
                                            name="name" placeholder="Số điện thoại"
                                            className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green"
                                            data-gtm-form-interact-field-id="4">
                                        </input>
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] mt-5 relative hoverFill">
                                        <div className="flex items-center justify-start ml-4">Thuộc sở hữu</div>
                                        <div className='w-[96.5%]'>
                                            <Select
                                                options={parentOptions}
                                                placeholder="-----"
                                                onChange={selectedOption => {
                                                    setParentID(selectedOption.value)
                                                    console.log(selectedOption.value)
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] mt-5">
                                        <div className="flex items-center justify-start ml-4">Vận chuyển</div>
                                        <div className="grid grid-cols-[215px_40px_215px]">
                                            <input
                                                value={transferFrom}
                                                onChange={e => setTransferFrom(e.target.value)}
                                                name="transferFrom" placeholder="Từ" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green border-red"></input>
                                            <div
                                                onChange={e => setTransferTo(e.target.value)}
                                                className="pl-2">_</div>
                                            <input
                                                value={transferTo}
                                                onChange={e => setTransferTo(e.target.value)}
                                                name="transferTo" placeholder="Đến" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green"></input>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] mt-5">
                                        <div className="flex items-center justify-start ml-4">Giá tiền</div>
                                        <div className="grid grid-cols-2 mb-5">
                                            <div className="flex">
                                                <input
                                                    placeholder='Kg'
                                                    value={pricePerKg}
                                                    onChange={e => setPricePerKg(e.target.value)}
                                                    name="pricePerKg" type="number" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green w-[60%]" />
                                                <div className="mt-1">/Kg</div>
                                            </div>
                                            <div className="flex">
                                                <input
                                                    placeholder='%'
                                                    value={pricePerPercent}
                                                    onChange={e => setPricePerPercente(e.target.value)}
                                                    type="number" name="pricePerPercent" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green w-[60%]" />
                                                <div className="mt-1">/%</div>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="grid grid-cols-2">
                                            <div className="flex">
                                                <input
                                                    value={pricePerPackage}
                                                    placeholder="Số kiện"
                                                    onChange={e => setPricePerPackage(e.target.value)}
                                                    type="number" name="pricePerPackage" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green w-[60%]" />
                                                <div className="mt-1">/Kiện</div>
                                            </div>
                                            <div className="flex">
                                                <input
                                                    value={pricePerBigPackage}
                                                    placeholder="Số kiện lớn"
                                                    onChange={e => setPricePerBigPackage(e.target.value)}
                                                    type="number" name="pricePerBigPackage" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green w-[60%]" />
                                                <div className="mt-1">/Kiện lớn</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[130px_1fr] mt-5">
                                        <div className="flex items-center justify-start ml-4">Ghi chú</div>
                                        <textarea
                                            value={note}
                                            placeholder="Nội dung ghi chú"
                                            onChange={e => setNote(e.target.value)}
                                            name="note" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green-600">
                                        </textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="float-right px-3 py-3">
                                <button
                                    onClick={handleShowFormInfoCustomer}
                                    className="w-14 h-8 border rounded-md mr-2 hover:text-cyan-400 hover:border-cyan-400"
                                >Hủy</button>
                                <button onClick={handleUpInfoCustomer} className={checkValue ? "w-14 h-8 rounded-md bg-[#337ab7] text-white" : "w-14 h-8 rounded-md bg-[#337ab7] opacity-50 text-white cursor-no-drop"}
                                >Sửa</button>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                        <ul className="flex flex-wrap -mb-px">
                            <li className="mr-2">
                                <Link
                                    className="inline-block p-3 border-b-2 border-transparent rounded-t-lg text-blue1 border-b-2 border-b-blue1 border-blue1 active"
                                    aria-current="page"
                                    to="items"
                                >
                                    Danh sách hàng hóa
                                </Link>
                            </li>
                            <li className="mr-2">
                                <Link
                                    className="inline-block p-3 border-b-2 border-transparent rounded-t-lg hover:bg-gray-100 hover:rounded-t "
                                    to="debit-histories"
                                >
                                    Lịch sử ghi nợ
                                </Link>
                            </li>
                            <li className="mr-2">
                                <Link
                                    className="inline-block p-3 border-b-2 border-transparent rounded-t-lg hover:bg-gray-100 hover:rounded-t "
                                    to="payment-histories"
                                >
                                    Lịch sử thanh toán
                                </Link>
                            </li>
                            <li className="mr-2">
                                <Link
                                    className="inline-block p-3 border-b-2 border-transparent rounded-t-lg hover:bg-gray-100 hover:rounded-t "
                                    to="report"
                                >
                                    Báo cáo
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <Outlet/>
                
            </div>    
        </>
    )
}

export default InfoCustomer