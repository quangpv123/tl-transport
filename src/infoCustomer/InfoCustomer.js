import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, Outlet } from 'react-router-dom';
import Select from 'react-select';
import { Popover, Button, Modal } from 'antd'
import { InfoCircleFilled, LoadingOutlined, CheckCircleFilled } from '@ant-design/icons'


function InfoCustomer() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
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
            setIsProcessing(true)
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
                setIsProcessing(false)
            } catch (error) {
                console.error(error);
                setIsProcessing(false)
            }
        };

        fetchData();
    }, [id])

    const upInfoCustomer = async () => {
        setIsProcessing(true)
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

    const checkValue = (mobile?.startsWith("03") || mobile?.startsWith("05") || mobile?.startsWith("07")
        || mobile?.startsWith("08") || mobile?.startsWith("09"))
        && mobile?.length === 10 && name && transferFrom && transferTo !== ""

    //Kiểm tra dataParents có phải mảng không trước khi render Option
    const parentOptions = Array.isArray(dataParents)
        ? [
            { value: null, label: "-----" },
            ...dataParents.map((item) => ({ value: item.id, label: item.name }))
        ]
        : [];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        if (checkValue) {
            upInfoCustomer();
            setIsModalOpen(false)
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={isProcessing ? 'z-[9999] absolute left-2/4 top-0 flex bg-amber-50 w-[160px] h-[40px] border border-amber-200 items-center' : 'hidden'}>
                <LoadingOutlined  className='mr-2 px-2'/>
                <p>Đang tải dữ liệu</p>
            </div>
            <div className={ showNotification ? 'px-4 py-2 bg-[white] z-[9999] shadow border absolute left-[40%] top-[8%] flex items-center' : 'hidden'}>
                <CheckCircleFilled className='text-[green]'/>
                <p>Cập nhật thông tin khách hàng thành công</p>
            </div>
            <div className="mx-auto mp-5 w-10/12 mt-[20px] max-w-[1124px]">

                <p className="text-[26px] flex items-center mb-4">
                    <span>Khách hàng:</span>
                    <span className="text-[22px] font-bold ml-1 text-ellipsis overflow-hidden max-w-[300px] m-0 block">
                        {data[id - 1]?.name}
                    </span>
                    <span className={data[id - 1]?.debt < 0 ? "text-[22px] mx-1 text-[red]" : data[id - 1]?.debt > 0 ? "text-[22px] mx-1 text-[green]" : "text-[22px] mx-1"}>
                        ( <span className="text-red">{new Intl.NumberFormat().format(data[id - 1]?.debt)} VNĐ</span> )
                    </span>
                    <Popover content={
                        <div className='w-[350px]'>
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
                                <button onClick={showModal} className='border px-2 py-1 rounded-md mt-1.5 mr-2 text-white bg-blue-500 hover:bg-blue-700'>Sửa</button>
                            </div>
                        </div>}
                        trigger="click"
                        placement="bottom"
                    >
                        <Button><InfoCircleFilled className="text-lg relative bottom-1.5" /></Button>
                    </Popover>
                </p>

                <Modal
                    width={600}
                    height={520}
                    cancelText="Hủy"
                    okText="Sửa"
                    okButtonProps={{ className: "bg-[#4096FF]" }}
                    title="Sửa thông tin khách hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                    footer={[
                        <Button onClick={handleCancel}>Hủy</Button>,
                        <button
                            onClick={handleOk}
                            className={checkValue ? "bg-[#1D4ED8] text-white px-4 py-1 ml-2 rounded" : "bg-[#99BCDB] cursor-no-drop text-white px-4 py-1 ml-2 rounded"}
                        >Sửa</button>
                    ]}
                >
                    <form>
                        <div className="grid grid-cols-[130px_1fr] mt-5">
                            <div className="flex items-center justify-start ml-2">Đối tác</div>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                name="name" placeholder="Tên"
                                className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green"
                                data-gtm-form-interact-field-id="4">
                            </input>
                        </div>
                        <div className="grid grid-cols-[130px_1fr] mt-5">
                            <div className="flex items-center justify-start ml-2">Số điện thoại</div>
                            <input
                                value={mobile}
                                onChange={e => setMobile(e.target.value)}
                                name="name" placeholder="Số điện thoại"
                                className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green"
                                data-gtm-form-interact-field-id="4">
                            </input>
                        </div>

                        <div className="grid grid-cols-[130px_1fr] mt-5 relative hoverFill">
                            <div className="flex items-center justify-start ml-2">Thuộc sở hữu</div>
                            <div className='w-[96.5%]'>
                                <Select
                                    options={parentOptions}
                                    placeholder="-----"
                                    onChange={selectedOption => {
                                        setParentID(selectedOption.value)
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-[130px_1fr] mt-5">
                            <div className="flex items-center justify-start ml-2">Vận chuyển</div>
                            <div className="grid grid-cols-[185px_40px_185px]">
                                <input
                                    value={transferFrom}
                                    onChange={e => setTransferFrom(e.target.value)}
                                    name="transferFrom" placeholder="Từ" className="numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green border-red">
                                </input>
                                <div className="pl-4">_</div>
                                <input
                                    value={transferTo}
                                    onChange={e => setTransferTo(e.target.value)}
                                    name="transferTo" placeholder="Đến" className="numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green">
                                </input>
                            </div>
                        </div>

                        <div className="grid grid-cols-[130px_1fr] mt-5">
                            <div className="flex items-center justify-start ml-2">Giá tiền</div>
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
                            <div className="flex items-center justify-start ml-2">Ghi chú</div>
                            <textarea
                                value={note}
                                placeholder="Nội dung ghi chú"
                                onChange={e => setNote(e.target.value)}
                                name="note" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green-600">
                            </textarea>
                        </div>
                    </form>
                </Modal>

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
                <Outlet />
            </div>
        </>
    )
}

export default InfoCustomer