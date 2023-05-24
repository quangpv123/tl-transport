import { useParams, Link } from "react-router-dom"
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { DatePicker, Select, Tag, Popover, Button, Checkbox, Modal } from 'antd'
import moment from 'moment'
import 'moment/locale/vi'
import axios from "axios"
import { CaretDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, DeleteFilled, StopFilled, LoadingOutlined, CheckCircleFilled } from '@ant-design/icons'
import ReactPaginate from "react-paginate"

function Items() {
    const { id } = useParams()
    const [showNotification, setShowNotification] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    //Lấy number page
    const [numberPage, setNumberPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(0)
    const [buttonTotal, setButtonTotal] = useState("")

    const handleSelectChange = (event) => {
        const selectedValue = parseInt(event.target.value);
        setNumberPage(selectedValue);
    };

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1);

    };

    //Lấy khoảng thời gian tìm kiếm
    const [fromDate, setFromDate] = useState(null)
    const [toDate, settoDate] = useState(null)
    const handleDateChange = (dates) => {
        if (dates) {
            const [start, end] = dates;
            const formattedStart = start ? moment(start).format('YYYY-MM-DD') : null;
            const formattedEnd = end ? moment(end).format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss') : null;
            setFromDate(formattedStart);
            settoDate(formattedEnd);
            console.log("Bắt đầu", formattedStart, "Kết thuc", formattedEnd)
        } else {
            setFromDate(null)
            settoDate(null)
            setCurrentPage(0)
            setShowPicker("hidden")
            setShowAllTime("relative text-sm left-[170px] cursor-pointer")
        }
    };

    // Lấy phương thức thanh toán
    const [paymentMethod, SetPaymentMethod] = useState(null)
    const onChange1 = (value) => {
        SetPaymentMethod(value)
    };
    // Lấy kho được tìm kiếm/kho thêm hàng
    const [dataOwner, setDataOwner] = useState([])
    const [filterByWarehouses, setFilterByWarehouses] = useState(null)
    const filterByWarehousesStr = Array.isArray(filterByWarehouses) && filterByWarehouses.length === 0 ? undefined : filterByWarehouses?.toString();

    useEffect(() => {
        const owner = async () => {
            setIsProcessing(true)
            try {
                const response = await axios.get('/api/chukhos', {
                    params: {
                        page: 1,
                        limit: 1000
                    }
                })
                setDataOwner(response.data.data)
                setIsProcessing(false)
            } catch (error) {
                console.log(error)
                setIsProcessing(false)
            }
        }
        owner()
    }, [])

    const onChange2 = (value) => {
        setFilterByWarehouses(value)
    };

    // Lấy trạng thái hàng hóa
    const tagsData = [
        { name: 'Đang chờ', status: 0, color: '#D9EDF7' },
        { name: 'Đang VC', status: 1, color: '#DFF0D8' },
        { name: 'Hoàn Thành VC', status: 4, color: '#dcfce7' },
        { name: 'Hoàn Thành', status: 2, color: '#bbf7d0' },
        { name: 'Đã giao KH', status: 3, color: '#86efac' },
        { name: 'Hủy', status: -3, color: '#E7E7E7' },
    ]
    const { CheckableTag } = Tag;
    const [selectStatus, setSelectStatus] = useState([]);
    const selectStatusStr = selectStatus.toString()
    const handleChange = (tag, checked) => {
        const nextSelectedTags = checked ? [...selectStatus, tag.status] : selectStatus.filter((t) => t !== tag.status);
        setSelectStatus(nextSelectedTags);
        setCurrentPage(0)
    };

    //Get API hàng hóa render ra màn hình
    const [dataGoods, setDataGoods] = useState([])
    const fetchHangHoa = useCallback(async () => {
        setIsProcessing(true)
        try {
            const response = await axios.get('/api/hanghoas', {
                params:
                {
                    status: selectStatusStr,
                    page: currentPage,
                    filterByWarehouses: filterByWarehousesStr,
                    fromDate: fromDate,
                    toDate: toDate,
                    numberpage: numberPage,
                    customer_id: id,
                    paymentMethod: paymentMethod
                }
            })
            setDataGoods(response.data)
            setButtonTotal(Math.ceil(response.data.count / numberPage))
            setIsProcessing(false)
        } catch (error) {
            console.log(error)
            setIsProcessing(false)
        } finally {
            setIdItem([])
        }
    }, [selectStatusStr, currentPage, filterByWarehousesStr, fromDate, toDate, numberPage, id, paymentMethod])
    useEffect(() => {
        fetchHangHoa()
    }, [fetchHangHoa])

    //Thêm hàng hóa
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [weight, setWeight] = useState(0)
    const [value, setvalue] = useState(0)
    const [selectedButton, setSelectedButton] = useState(null);
    const [price, setPrice] = useState("")
    const [fromDateAdd, setFromDateAdd] = useState("")
    const [note, setNote] = useState("")
    const [from, setFrom] = useState(null)
    const [to, setTo] = useState(null)


    const showModal = () => {
        setOpen(true);
    };
    const handleSubmitAndContinue = () => {
        setLoading(true);
        addItems()
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
    const handleSubmitAndOut = () => {
        setLoading(true);
        addItems()
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 2000);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const setPayType = (value) => {
        setSelectedButton(value);
    };

    useEffect(() => {
        const getInfo = async () => {
            setIsProcessing(true)
            try {
                const response = await axios.get(`/api/khachhangs/${id}`)
                setFrom(response.data.transferFrom)
                setTo(response.data.transferTo)
                setIsProcessing(false)
            } catch (error) {
                console.log(error)
                setIsProcessing(false)
            }
        }
        getInfo()
    }, [id])

    const addItems = async () => {
        setIsProcessing(true)
        try {
            await axios.post('/api/hanghoas', {
                customerId: id,
                from,
                fromDate: fromDateAdd,
                name,
                note,
                payType: selectedButton,
                price_unit: price,
                to,
                value,
                warehouseId: filterByWarehousesStr,
                weight,

            })
            setIsProcessing(false)
            setShowNotification(true)
            setTimeout(() => {
                setShowNotification(false);
              }, 2000)
        } catch (error) {
            console.log(error)
            setIsProcessing(false)
        }
    }

    /// Xóa hàng hóa
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
    const [modalStopOpen, setModalStopOpen] = useState(false)
    const [idItem, setIdItem] = useState([])
    const [idBtn, setInBtn] = useState("")


    const handleListId = (e, id) => {
        const { checked } = e.target
        setIdItem([...idItem, id])
        if (!checked) {
            setIdItem(idItem.filter(item => item !== id))
        }
    }

    const onCheckAll = (e) => {
        const checkAlll = idItem.length === dataGoods?.data?.length && dataGoods?.data?.length !== 0;
        if (checkAlll) {
            setIdItem([])
        } else {
            setIdItem(dataGoods?.data?.map(i => i.id))
        }
    }

    const showModalDelete = (id) => {
        setModalDeleteOpen(true);
        setIdItem([...idItem, id])
        setInBtn(id)
    }

    const showModalStop = (id) => {
        setModalStopOpen(true);
        setIdItem([...idItem, id])
        setInBtn(id)
    }

    const handleCancelModal = () => {
        setModalDeleteOpen(false)
        setModalStopOpen(false)
        setIdItem(idItem.filter(item => item !== idBtn))
    }
    const handleOkDelete = async () => {
        setIsProcessing(true)
        try {
           await axios.post('/api/hanghoas/delete', { id: idItem });
           setIsProcessing(false)
        } catch (error) {
            console.error(error);
            setIsProcessing(false)
        } finally {
            setIdItem([])
            fetchHangHoa()
            setModalDeleteOpen(false)
            
        }
    }

    const handleOkStop = async () => {
        setIsProcessing(true)
        try {
            await axios.post(`/api/hanghoas/${idItem}/-3`);
            setIsProcessing(false)
        } catch (error) {
            console.error(error);
            setIsProcessing(false)
        } finally {
            setIdItem([])
            fetchHangHoa()
            setModalStopOpen(false)
        }
    }

    //Chọn cột hiển thị, chuyển vị trí cột

    const [itemFields, setItemFields] = useState([])
    const [updatedItemFields, setUpdatedItemFields] = useState([])

    const fetchItemFields = async () => {
        try {
            const response = await axios.get('/api/user/item-fields')
            setItemFields(response.data)
            setUpdatedItemFields(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchItemFields()
    }, [])

    const fetchItemFieldsUpdate = async () => {
        try {
            await axios.post('/api/user/item-fields', updatedItemFields)
            fetchItemFields()
        } catch (error) {
            console.log(error)
        }
    }

    const [update, setUpdate] = useState([])
    const updatedShowColumns = (id, checked) => {
        const update = updatedItemFields?.map(item => {
            if (item.id === id) {
                return { ...item, selected: checked }
            }
            return item
        })
        setUpdatedItemFields(update)
    }

    const deleteUpdate = () => {
        setOpenPopover(false)
        setUpdatedItemFields(itemFields)
    }

    const moveLeft = (index, itemFields) => {
        for (let i = index - 1; i >= 0; i--) {
            if (itemFields[i].selected) {
                const temp = updatedItemFields[index];
                updatedItemFields[index] = updatedItemFields[i];
                updatedItemFields[i] = temp
                break;
            }
        }
        fetchItemFieldsUpdate()
    }

    const moveRight = (index, itemFields) => {
        for (let i = index + 1; i < itemFields.length; i++) {
            if (itemFields[i].selected) {
                const temp = updatedItemFields[index];
                updatedItemFields[index] = updatedItemFields[i];
                updatedItemFields[i] = temp
                break;
            }
        }
        fetchItemFieldsUpdate()
    }

    const reset = () => {
        setUpdatedItemFields([
            {
                "id": 1,
                "name": "customer",
                "label": "Khách hàng",
                "colName": "Khách hàng",
                "selected": true,
                "order": 0
            },
            {
                "id": 2,
                "name": "name",
                "label": "Tên hàng hoá",
                "colName": "Hàng hoá",
                "selected": true,
                "order": 1
            },
            {
                "id": 3,
                "name": "weight",
                "label": "Cân nặng",
                "colName": "KG",
                "selected": true,
                "order": 2
            },
            {
                "id": 4,
                "name": "partner",
                "label": "Đối tác",
                "colName": "Đối tác",
                "selected": true,
                "order": 3
            },
            {
                "id": 5,
                "name": "startDate",
                "label": "Ngày nhận",
                "colName": "Ngày nhận",
                "selected": true,
                "order": 4
            },
            {
                "id": 6,
                "name": "endDate",
                "label": "Ngày giao hàng",
                "colName": "Ngày giao hàng",
                "selected": true,
                "order": 5
            },
            {
                "id": 7,
                "name": "customerPaid",
                "label": "Khách hàng trả",
                "colName": "Khách hàng trả",
                "selected": true,
                "order": 6
            },
            {
                "id": 8,
                "name": "payPartner",
                "label": "Trả đối tác",
                "colName": "Trả đối tác",
                "selected": true,
                "order": 7
            },
            {
                "id": 9,
                "name": "prepaid",
                "label": "Trả trước",
                "colName": "Trả trước",
                "selected": true,
                "order": 8
            },
            {
                "id": 10,
                "name": "remainPrice",
                "label": "Còn lại",
                "colName": "Còn lại",
                "selected": true,
                "order": 9
            },
            {
                "id": 11,
                "name": "currentLocation",
                "label": "Vị trí hiện tại",
                "colName": "Vị trí",
                "selected": false,
                "order": 10
            },
            {
                "id": 12,
                "name": "from",
                "label": "Gửi từ",
                "colName": "Gửi từ",
                "selected": false,
                "order": 11
            },
            {
                "id": 13,
                "name": "to",
                "label": "Gửi đến",
                "colName": "Gửi đến",
                "selected": false,
                "order": 12
            },
            {
                "id": 14,
                "name": "payType",
                "label": "Cách trả phí",
                "colName": "Cách trả phí",
                "selected": false,
                "order": 13
            },
            {
                "id": 15,
                "name": "value",
                "label": "Giá trị hàng",
                "colName": "Giá trị hàng",
                "selected": false,
                "order": 14
            },
            {
                "id": 16,
                "name": "status",
                "label": "Trạng thái",
                "colName": "Trạng thái",
                "selected": false,
                "order": 15
            },
            {
                "id": 17,
                "name": "warehouse",
                "label": "Kho",
                "colName": "Kho",
                "selected": false,
                "order": 16
            },
            {
                "id": 18,
                "name": "priceUnit",
                "label": "Tỉ giá",
                "colName": "Tỉ giá",
                "selected": true,
                "order": 17
            }
        ])
    }
//Ẩn cột dữ liệu khi ấn điểm bất kỳ
    const [openPopover, setOpenPopover] = useState(false)
    const popoverRef = useRef(null)
    useEffect (()=>{
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setOpenPopover(false)
            }
          }

          document.getElementById("setclms").addEventListener('click', handleClickOutside);
      
          return () => {
            document.removeEventListener('click', handleClickOutside);
          };
    }, [])
    const [showPicker, setShowPicker] = useState("hidden")
    const [showAllTime, setShowAllTime] = useState("relative text-sm left-[170px] cursor-pointer")

    const handlePicker = () => {
        setShowPicker("")
        setShowAllTime("hidden")
    }
    console.log(itemFields)
    return (
        <>  
            <div className={isProcessing ? 'z-[9999] absolute left-2/4 top-0 flex bg-amber-50 w-[160px] h-[40px] border border-amber-200 items-center' : 'hidden'}>
                <LoadingOutlined  className='mr-2 px-2'/>
                <p>Đang tải dữ liệu</p>
            </div>
            <div id = "notification" className={ showNotification ? 'z-[9999] absolute left-[40%] top-[8%] flex items-center border shadow bg-[white] px-4 py-2' : 'hidden'}>
                <CheckCircleFilled className='text-[green]'/>
                <p>Một hàng hóa vừa được thêm mới</p>
            </div>
            <div id = "setclms">
            <div className="grid grid-cols-[400px_240px_150px_300px] mx-auto gap-4 items-center">
                <div className="relative mt-3">
                    <div className="grid grid-cols-[400px_240px_150px_300px] mx-auto mb-4 gap-4 items-center">
                        <div className="flex items-center">
                            <h1 className="font-medium text-2xl mr-2">Danh sách hàng hóa</h1>
                            <svg onClick={showModal} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" color="#337ab7" className="text-lg cursor-pointer" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(51, 122, 183)' }}>
                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z">
                                </path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <DatePicker.RangePicker
                        className={showPicker}
                        onChange={handleDateChange}
                    />
                    <p  
                        onClick={handlePicker}
                        className={showAllTime}>All time<CaretDownOutlined className="relative top-[-2px] left-1"/></p>
                </div>
                <Select
                    showSearch
                    placeholder="Cách trả phí"
                    optionFilterProp="children"
                    onChange={onChange1}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        { value: "", label: 'Tất cả' },
                        { value: 1, label: 'Cân nặng' },
                        { value: 2, label: 'Kiện' },
                        { value: 3, label: 'Kiện lớn' },
                        { value: 4, label: 'Phần trăm' },
                        { value: 5, label: 'Tự nhập' }
                    ]}
                />
                <Select
                    allowClear
                    mode="multiple"
                    showSearch
                    placeholder='Tìm kiếm theo kho'
                    onChange={onChange2}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={
                        Array.isArray(dataOwner) ? dataOwner?.map((item) => {
                            return ({
                                value: item.id,
                                label: item.name
                            })
                        }) : []
                    }
                />
                <div className="flex justify-between mb-4 items-center">
                    <div className="flex justify-between w-[50%] mt-2 mb-2">
                        {tagsData.map((tag) => (
                            <CheckableTag
                                key={tag.id}
                                checked={selectStatus.includes(tag.status)}
                                onChange={(checked) => handleChange(tag, checked)}
                                style={selectStatus.includes(tag.status) ? { backgroundColor: tag.color, color: "black" } : null}
                                className="relative"

                            >   <span
                                style={{ backgroundColor: tag.color }}
                                className="absolute top-1/2 left-[3.5px] transform -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full">
                                </span>
                                {tag.name}
                            </CheckableTag>
                        ))}
                    </div>
                </div>

            </div>
            <div ref={popoverRef} className="text-right relative bottom-[70px]">
                <Popover
                    open={openPopover}
                    trigger="click"
                    placement="bottom"
                    content={
                        <div className="w-[210px] h-[360px]">
                            <input type="text" className="w-full p-1 border mt-1 mb-3 focus-visible:outline-none rounded-sm"></input>
                            <Button onClick={reset} type="link">Mặc định</Button>
                            <div className="h-[220px] overflow-auto">
                                {updatedItemFields.map((item) => {
                                    return (
                                        <Checkbox
                                            className="flex mx-2 my-2"
                                            key={item.id}
                                            checked={item.selected}
                                            onChange={e => updatedShowColumns(item.id, e.target.checked)}
                                        >{item.label}</Checkbox>
                                    )
                                })}
                            </div>
                            <div className="text-right border-t-2 pt-4 mt-2">
                                <Button onClick={deleteUpdate}>Hủy</Button>
                                <Button onClick={fetchItemFieldsUpdate} className="bg-blue-700 text-white ml-2">Lưu</Button>
                            </div>
                        </div>
                    }
                >
                    <Button onClick={e => setOpenPopover(!openPopover)} className="border-none">Cột dữ liệu <CaretDownOutlined className="text-xs relative bottom-px right-2" /></Button>
                </Popover>
            </div>

            <table>
                <thead className="border-b">
                    <tr>
                        <th className={selectStatus.length === 1 ? "relative right-1" : "hidden"}>
                            <Checkbox onClick={e => onCheckAll(e)} checked={
                                idItem.length === dataGoods?.data?.length && dataGoods?.data?.length !== 0
                            }></Checkbox>
                            <Popover
                                className={idItem.length === 0 ? "hidden" : "w-[2px] h-[2px]"}
                                content={
                                <div className="flex flex-col">
                                <Button onClick={e => setModalDeleteOpen(true)} type="text">Xóa đơn hàng</Button>
                                <Button onClick={e => setModalStopOpen(true)} type="text">Hủy đơn hàng</Button>
                                </div>
                                } 
                                trigger="click"
                                placement="bottomRight"
                                >
                                <Button className="absolute border-none left-3 top-5"><CaretDownOutlined /></Button>
                            </Popover>
                        </th>
                        <th className="px-4">STT</th>
                        {
                            itemFields?.map((item, index) => {
                                if (item.selected) {
                                    return (
                                        <th className='px-4 relative w-24 group' key={item.id}>
                                            {item.colName}
                                            <div className="absolute w-full h-full bg-slate-300 inset-0 hidden group-hover:flex">
                                                <Button
                                                    data-value={index}
                                                    onClick={() => moveLeft(index, itemFields)}
                                                    className={index === 0 ? "hidden" :
                                                        index === itemFields.length - 1 ? "w-full h-full rounded-none flex items-center justify-center" :
                                                            "w-6/12 h-full rounded-none flex items-center justify-center"}
                                                    type="text"
                                                ><ArrowLeftOutlined /></Button>
                                                <Button
                                                    onClick={() => moveRight(index, itemFields)}
                                                    data-value={index}
                                                    className={index === 0 ? "w-full h-full rounded-none flex items-center justify-center" :
                                                        index === itemFields.length - 1 ? "hidden" :
                                                            "w-6/12 h-full rounded-none flex items-center justify-center"}
                                                    type="text"
                                                ><ArrowRightOutlined /></Button>
                                            </div>
                                        </th>
                                    )
                                }
                                return null
                            })
                        }
                    </tr>
                </thead>

                <tbody className="border-b">
                    {
                        dataGoods.data?.map((item, index) => {
                            return (
                                <tr key={index}
                                    className={selectStatus?.length === 0 ? "border-b group" :
                                        (() => {
                                            switch (item.status) {
                                                case "0":
                                                    return "border-b bg-[#D9EDF7] group"
                                                case "1":
                                                    return "border-b bg-[#DFF0D8] group"
                                                case "2":
                                                    return "border-b bg-[#bbf7d0] group"
                                                case "3":
                                                    return "border-b bg-[#86efac] group"
                                                case "4":
                                                    return "border-b bg-[#dcfce7] group"
                                                case "-3":
                                                    return "border-b bg-[#E7E7E7] group"
                                                default:
                                                    return null
                                            }

                                        })()
                                    }>
                                    <td className={selectStatus?.length === 1 ? "px-2" : "hidden"}>
                                        <Checkbox
                                            onChange={e => handleListId(e, item.id)}
                                            checked={idItem?.includes(item.id)}
                                        ></Checkbox>
                                    </td>

                                    <td className="px-4">
                                        <div>{currentPage > 0 ? numberPage * (currentPage - 1) + index + 1 : index + 1}</div>
                                        <div className="relative bottom-1 hidden group-hover:flex">
                                            <Popover content={(<div>Xóa</div>)}>
                                            <button
                                                onClick={() => showModalDelete(item.id)}
                                                className="absolute"
                                            ><DeleteFilled className="text-indigo-700" />
                                            </button>
                                            </Popover>
                                            <Popover content={(<div>Hủy</div>)}>
                                            <button
                                                onClick={() => showModalStop(item.id)}
                                                className={item.status === "-3" ? "hidden" : "absolute left-4"}
                                            ><StopFilled className="text-indigo-700" />
                                            </button>
                                            </Popover>
                                        </div>
                                    </td>


                                    {itemFields?.map((i, index) => {
                                        if (i.selected) return (
                                            <td className='px-4 py-4' key={index}>
                                                {
                                                    i.name === 'customer' ? <Link to='/' className="text-indigo-700">{item.customer.name}</Link> :
                                                    i.name === 'name' ? <Link to='/' className="text-indigo-700">{item.name}</Link> :
                                                    i.name === 'partner' ? <Link to='/' className="text-indigo-700">{item.partner.name}</Link> :
                                                    i.name === 'weight' ? <Link to='/' className="text-indigo-700">{Intl.NumberFormat().format(item.weight)}</Link> :
                                                    i.name === 'startDate' ? item.fromDate.split(" ")[0] :
                                                    i.name === 'endDate' ? item.finishDelivery :
                                                    i.name === 'customerPaid' ? Intl.NumberFormat().format(item.price) :
                                                    i.name === 'payPartner' ? Intl.NumberFormat().format(item.price * 60 / 100) :
                                                    i.name === 'prepaid' ? Intl.NumberFormat().format(item.price) :
                                                    i.name === 'remainPrice' ? item.price*40/100 :
                                                    i.name === 'currentLocation' ? item.currentLocation :
                                                    i.name === 'from' ? item.from :
                                                    i.name === 'to' ? item.to :
                                                    i.name === 'payType' ? (() => {
                                                        switch (item.payType) {
                                                            case "1":
                                                                return "Cân nặng";
                                                            case "2":
                                                                return "Kiện";
                                                            case "3":
                                                                return "Kiện lớn";
                                                            case "4":
                                                                return "Phần trăm";
                                                            case "5":
                                                                return "Tự nhập";
                                                            default:
                                                                return null;
                                                        }
                                                    })() :
                                                        i.name === 'value' ? Intl.NumberFormat().format(item.value) :
                                                        i.name === 'status' ? (() => {
                                                            switch (item.status) {
                                                                case "0":
                                                                        return "Đang chờ";
                                                                case "1":
                                                                        return "Đang VC";
                                                                case "2":
                                                                        return "Hoàn thành";
                                                                case "3":
                                                                        return "Đã giao KH";
                                                                case "4":
                                                                        return "Hoàn thành VC";
                                                                case "-3":
                                                                        return "Hủy";
                                                                default:
                                                                        return null;
                                                                }
                                                            })() :
                                                            i.name === 'warehouse' ? <Link to='/' className="text-indigo-700">{item.warehouse?.name}</Link> :
                                                            i.name === 'priceUnit' ? Intl.NumberFormat().format(item.price_unit) :
                                                            null                                                   
                                                }
                                            </td>
                                        )
                                        return null
                                    }
                                    )}

                                </tr>
                            )
                        })
                    }
                </tbody>
                <tfoot className="font-medium">
                    <tr>
                        <td>{dataGoods.count > 0 ? dataGoods.count : null}</td>
                        {
                            itemFields?.map((item)=>{
                               if(item.selected){
                                return (
                                <td className= {item.name === 'remainPrice' && dataGoods.totalPrice*40/100 > 0 ? "text-emerald-400" : null }>
                                {item.name === 'weight' ? Intl.NumberFormat().format(dataGoods.totalKg) + " KG":
                                item.name === 'customerPaid' ? Intl.NumberFormat().format(dataGoods.totalPrice) + " VNĐ" :
                                item.name === 'payPartner' ? Intl.NumberFormat().format(dataGoods.totalPrice*60/100) + " VNĐ" :
                                item.name === 'prepaid' ? Intl.NumberFormat().format(dataGoods.totalPrice) + " VNĐ" :
                                item.name === 'remainPrice' ? Intl.NumberFormat().format(dataGoods.totalPrice*40/100) + " VNĐ" : null} 
                                </td>)
                            }
                            return null

                            })
                        }
                    </tr>
                </tfoot>
                <Modal
                    title="Confirm Delete"
                    cancelText="Hủy"
                    okText="Thực hiện"
                    okButtonProps={{ className: "bg-[#BB0000] hover:bg-[blue]" }}
                    open={modalDeleteOpen} onOk={handleOkDelete} onCancel={handleCancelModal}>
                    <p>Bạn có muốn xóa không?</p>
                </Modal>
                <Modal
                    title="Xác nhận cập nhật trạng thái hủy"
                    cancelText="Cancel"
                    okText="Thực hiện"
                    okButtonProps={{ className: "bg-[#BB0000] hover:bg-[blue]" }}
                    open={modalStopOpen} onOk={handleOkStop} onCancel={handleCancelModal}>
                    <p>Bạn có muốn huỷ không?</p>
                </Modal>
            </table>
            <div className="flex mt-2 justify-between pt-4">
                <div className={dataGoods.count > 0 ? "flex" : "hidden"}>
                    <p className="text-sm text-gray-700 mr-3 mt-[1px]">Kích thước trang:</p>
                    <select
                        value={numberPage}
                        onChange={handleSelectChange}
                        className="border border-[#333] w-[100px] h-[25px]">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                    </select>
                </div>
                {buttonTotal > 1 && <ReactPaginate
                    pageCount={buttonTotal}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageChange}
                    initialPage={currentPage}
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    containerClassName={'inline-flex items-cente text-sm text-[#337ab7] border border-gray-300 rounded-md bg-white'}
                    activeClassName={'text-white bg-indigo-600'}
                    previousClassName={'px-2 py-2 text-center px-4'}
                    nextClassName={'px-2 py-2 text-center px-4'}
                    pageClassName={'px-2 py-2 text-center px-4 border hover:bg-slate-300'}
                    breakClassName={'px-2 py-2 text-center px-4 border'}
                />}
            </div>
            <p className={dataGoods.count <= 0 ? "text-center text-[red]" : "hidden"}>Không có dữ liệu trùng khớp</p>
            <Modal
                width={'600px'}
                open={open}
                title={`Thêm mới hàng hóa: ${from} - ${to}`}
                onOk={handleSubmitAndOut}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button
                        className="bg-indigo-700"
                        key="submit and continue" type="primary" loading={loading}
                        onClick={handleSubmitAndContinue}>
                        Tạo mới và tiếp tục
                    </Button>,
                    <Button
                        className="bg-indigo-700"
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleSubmitAndOut}
                    >
                        Tạo mới
                    </Button>,
                ]}
            >
                <form>
                    <div className="grid grid-cols-[130px_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Kho</div>
                        <Select
                            allowClear
                            showSearch
                            onChange={onChange2}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={
                                Array.isArray(dataOwner) ? dataOwner?.map((item) => {
                                    return ({
                                        value: item.id,
                                        label: item.name
                                    })
                                }) : []
                            }
                        />
                    </div>
                    <div className="grid grid-cols-[130px_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Tên hàng hóa</div>
                        <input
                            onChange={e => setName(e.target.value)}
                            type="text" name="name" className="w-[100%] mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-[green]">
                        </input>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Cân nặng</div>
                        <div className="flex items-center">
                            <input
                                onChange={e => setWeight(e.target.value)}
                                type="number" name="weight" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-[green] border-red w-[30%]"></input>
                            <span>(Kg)</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Giá trị hàng hóa</div>
                        <input
                            onChange={e => setvalue(e.target.value)}
                            type="number" name="value" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-[green] w-[40%]">
                        </input>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Cách trả phí</div>
                        <div className="grid grid-cols-3 ">
                            <button
                                type="button"
                                onClick={() => setPayType("1")}
                                className={selectedButton === "1" ? "border w-[70%] px-2.5 py-1.5 rounded-3xl bg-indigo-700 text-white" :
                                    "border w-[70%] px-2.5 py-1.5 rounded-3xl bg-[#f0f0f0] text-black"}
                            >Cân nặng
                            </button>
                            <button
                                type="button"
                                onClick={() => setPayType("2")}
                                className={selectedButton === "2" ? "border w-[70%] px-2.5 py-1.5 rounded-3xl bg-indigo-700 text-white" :
                                    "border w-[70%] px-2.5 py-1.5 rounded-3xl bg-[#f0f0f0] text-black"}
                            >Kiện
                            </button>
                            <button
                                type="button"
                                onClick={() => setPayType("3")}
                                className={selectedButton === "3" ? "border w-[70%] px-2.5 py-1.5 rounded-3xl bg-indigo-700 text-white" :
                                    "border w-[70%] px-2.5 py-1.5 rounded-3xl bg-[#f0f0f0] text-black"}
                            >Kiện lớn
                            </button>
                            <button
                                type="button"
                                onClick={() => setPayType("4")}
                                className={selectedButton === "4" ? "border w-[70%] px-2.5 py-1.5 rounded-3xl bg-indigo-700 text-white mt-3" :
                                    "border w-[70%] px-2.5 py-1.5 rounded-3xl text-black bg-[#f0f0f0] mt-3"}
                            >Phần trăm
                            </button>
                            <button
                                type="button"
                                onClick={() => setPayType("5")}
                                className={selectedButton === "5" ? "border w-[70%] px-2.5 py-1.5 rounded-3xl bg-indigo-700 text-white mt-3" :
                                    "border w-[70%] px-2.5 py-1.5 rounded-3xl text-black bg-[#f0f0f0] mt-3"}
                            >Tự nhập
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-[130px_1fr_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Chi phí</div>
                        <input
                            onChange={e => setPrice(e.target.value)}
                            type="number" name="price_unit" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-[green]">
                        </input>
                        <p>= 0</p>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Ngày nhận</div>
                        <DatePicker
                            onChange={(date, dateString) => setFromDateAdd(dateString)}
                        />
                    </div>
                    <div className="grid grid-cols-[130px_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Ghi chú</div>
                        <textarea
                            onChange={e => setNote(e.target.value)}
                            name="note" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-[green] w-[100%]">
                        </textarea>
                    </div>
                </form>
            </Modal>
            </div>  
        </>
    )
}

export default Items