import { useContext, useState, useRef, useEffect } from 'react'
import axios from 'axios'
import Select from 'react-select'

import './AddCustomer.css'
import './ListCustomers'
import DataContext from './DataContext'
import { LoadingOutlined, CheckCircleFilled } from '@ant-design/icons'


function AddCustomer({ handleShowForm }) {

    const dataParents = useContext(DataContext).dataParents
    const borderBlack = "mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green"
    const borderRed = "mr-4 numberInput border border-[red] text-sm block p-1.5 rounded-sm outline-green"
    const [borderColorName, setBorderColorName] = useState(borderBlack)
    const [borderColorMobile, setBorderColorMobile] = useState(borderBlack)
    const [borderColorFrom, setBorderColorFrom] = useState(borderBlack)
    const [borderColorTo, setBorderColorTo] = useState(borderBlack)

    const handleHidden = () => {
        handleShowForm(false)
    }

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
    const [isProcessing, setIsProcessing] = useState(false)
    const [showNotification, setShowNotification] = useState(false)

    const upInfoCustomer = async () => {
        setIsProcessing(true)
        try {
            await axios.post('/api/khachhangs',
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
            setIsProcessing(false)
            setShowNotification(true)
            setTimeout(() => {
                setShowNotification(false);
              }, 2000);
        } catch (error) {
            console.error(error);
            setIsProcessing(false)
        }
    };

    const checkValue = (mobile.startsWith("03") || mobile.startsWith("05") || mobile.startsWith("07")
        || mobile.startsWith("08") || mobile.startsWith("09"))
        && mobile.length === 10 && name && transferFrom && transferTo

    const handleUpInfoCustomer = () => {
        if (checkValue) {
            upInfoCustomer();
        }
    }

    const changeBorderColorName = () => {
        name.length === 0 ? setBorderColorName(borderRed) : setBorderColorName(borderBlack)
    }
    const changeBorderColorMobile = () => {
        (mobile.startsWith("03") || mobile.startsWith("05") || mobile.startsWith("07")
            || mobile.startsWith("08") || mobile.startsWith("09"))
            && mobile.length === 10 ? setBorderColorMobile(borderBlack) : setBorderColorMobile(borderRed)
    }
    const changeBorderColorFrom = () => {
        transferFrom.length === 0 ? setBorderColorFrom(borderRed) : setBorderColorFrom(borderBlack)
    }
    const changeBorderColorTo = () => {
        transferTo.length === 0 ? setBorderColorTo(borderRed) : setBorderColorTo(borderBlack)
    }

    const addRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addRef.current && !addRef.current.contains(event.target)) {
                handleShowForm(false)
            }
        }

        document.getElementById("addctm").addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleShowForm])


    return (
        <>  <div className={isProcessing ? 'z-[9999] absolute left-2/4 top-0 flex bg-amber-50 w-[160px] h-[40px] border border-amber-200 items-center' : 'hidden'}>
                <LoadingOutlined className='mr-2 px-2' />
                <p>Đang tải dữ liệu</p>
            </div>
            <div className={ showNotification ? 'absolute left-[40%] top-[8%] flex items-center' : 'hidden'}>
                <CheckCircleFilled className='text-[green]'/>
                <p>Một khách hàng được thêm thành công</p>
            </div>
            <div id="addctm" className="modalOverlay absolute w-full h-full bg-black/20"></div>
            <div ref={addRef} className="modalBody h-[500px] w-11/12 max-w-[600px] bg-white mx-auto mt-24 z-10 rounded">
                <div className="flex justify-between px-3 py-3">
                    <h1 className="font-medium">Thêm khách hàng</h1>
                    <button onClick={handleHidden}>
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
                                onBlur={changeBorderColorName}
                                onChange={e => setName(e.target.value)}
                                name="name" placeholder="Tên"
                                className={borderColorName}
                                data-gtm-form-interact-field-id="4">
                            </input>
                        </div>
                        <div className="grid grid-cols-[130px_1fr] mt-5">
                            <div className="flex items-center justify-start ml-4">Số điện thoại</div>
                            <input
                                onBlur={changeBorderColorMobile}
                                onChange={e => setMobile(e.target.value)}
                                name="mobile" placeholder="Số điện thoại"
                                className={borderColorMobile}
                                data-gtm-form-interact-field-id="4">
                            </input>
                        </div>

                        <div className="grid grid-cols-[130px_1fr] mt-5 relative hoverFill">
                            <div className="flex items-center justify-start ml-4">Thuộc sở hữu</div>
                            <div className='w-[96.5%]'>
                                <Select
                                    options={[
                                        { value: null, label: "-----" },
                                        ...dataParents?.map((item) => ({ value: item.id, label: item.name }))
                                    ]}
                                    placeholder="-----"
                                    onChange={selectedOption => {
                                        setParentID(selectedOption.value)
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-[130px_1fr] mt-5">
                            <div className="flex items-center justify-start ml-4">Vận chuyển</div>
                            <div className="grid grid-cols-[215px_40px_215px]">
                                <input
                                    onBlur={changeBorderColorFrom}
                                    onChange={e => setTransferFrom(e.target.value)}
                                    name="transferFrom" placeholder="Từ" className={borderColorFrom}>

                                </input>
                                <div className="pl-2">_</div>
                                <input
                                    onBlur={changeBorderColorTo}
                                    onChange={e => setTransferTo(e.target.value)}
                                    name="transferTo" placeholder="Đến" className={borderColorTo}>

                                </input>
                            </div>
                        </div>

                        <div className="grid grid-cols-[130px_1fr] mt-5">
                            <div className="flex items-center justify-start ml-4">Giá tiền</div>
                            <div className="grid grid-cols-2 mb-5">
                                <div className="flex">
                                    <input
                                        onChange={e => setPricePerKg(e.target.value)}
                                        name="pricePerKg" type="number" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green w-[60%]" />
                                    <div className="mt-1">/Kg</div>
                                </div>
                                <div className="flex">
                                    <input
                                        onChange={e => setPricePerPercente(e.target.value)}
                                        type="number" name="pricePerPercent" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green w-[60%]" />
                                    <div className="mt-1">/%</div>
                                </div>
                            </div>
                            <br />
                            <div className="grid grid-cols-2">
                                <div className="flex">
                                    <input
                                        onChange={e => setPricePerPackage(e.target.value)}
                                        type="number" name="pricePerPackage" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green w-[60%]" />
                                    <div className="mt-1">/Kiện</div>
                                </div>
                                <div className="flex">
                                    <input
                                        onChange={e => setPricePerBigPackage(e.target.value)}
                                        type="number" name="pricePerBigPackage" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green w-[60%]" />
                                    <div className="mt-1">/Kiện lớn</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-[130px_1fr] mt-5">
                            <div className="flex items-center justify-start ml-4">Ghi chú</div>
                            <textarea onChange={e => setNote(e.target.value)}
                                name="note" placeholder="Ghi chú" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green-600">
                            </textarea>
                        </div>
                    </form>
                </div>
                <div className="float-right px-3 py-3">
                    <button onClick={handleHidden} className="w-14 h-8 border rounded-md mr-2 hover:text-cyan-400 hover:border-cyan-400"
                    >Hủy</button>
                    <button onClick={handleUpInfoCustomer} className={checkValue ? "w-20 h-8 rounded-md bg-[#337ab7] text-white" : "w-20 h-8 rounded-md bg-[#337ab7] opacity-50 text-white cursor-no-drop"}
                    >Tạo mới</button>
                </div>
            </div>
        </>
    )
}

export default AddCustomer