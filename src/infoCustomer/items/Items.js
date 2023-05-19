import { useParams, Link } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import { DatePicker, Select, Tag, Popover, Button, Checkbox, Modal } from 'antd'
import moment from 'moment'
import 'moment/locale/vi'
import axios from "axios"
import { CaretDownOutlined } from '@ant-design/icons'
import ReactPaginate from "react-paginate"

function Items() {
    const { id } = useParams()
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
            try {
                const response = await axios.get('/api/chukhos', {
                    params: {
                        page: 1,
                        limit: 1000
                    }
                })
                setDataOwner(response.data.data)
            } catch (error) {
                console.log(error)
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

    useEffect(() => {
        const fetchHangHoa = async () => {
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
            } catch (error) {
                console.log(error)
            }
        }
        fetchHangHoa()
    }, [selectStatusStr, currentPage, filterByWarehousesStr, fromDate, toDate, numberPage, id, paymentMethod])
    //items select colum table
    const itemsTableColumn = [
        { label: 'Khách hàng', value: 'Khách hàng' },
        { label: 'Tên hàng hóa', value: 'Tên hàng hóa' },
        { label: 'Đối tác', value: 'Đối tác' },
        { label: 'Cân nặng(KG)', value: 'Cân nặng(KG)' },
        { label: 'Ngày nhận', value: 'Ngày nhận' },
        { label: 'Ngày giao hàng', value: 'Ngày giao hàng' },
        { label: 'Khách hàng trả', value: 'Khách hàng trả' },
        { label: 'Trả đối tác', value: 'Trả đối tác' },
        { label: 'Trả trước', value: 'Trả trước' },
        { label: 'Còn lại', value: 'Còn lại' },
        { label: 'Vị Trí hiện tại', value: 'Vị Trí hiện tại' },
        { label: 'Gửi từ', value: 'Gửi từ' },
        { label: 'Gửi đến', value: 'Gửi đến' },
        { label: 'Cách trả phí', value: 'Cách trả phí' },
        { label: 'Giá trị hàng', value: 'Giá trị hàng' },
        { label: 'Trạng thái', value: 'Trạng thái' },
        { label: 'Kho', value: 'Kho' },
        { label: 'Tỉ giá', value: 'Tỉ giá' }
    ]

    const defaultItemsTableColumn = [
        'Khách hàng', 'Tên hàng hóa', 'Cân nặng(KG)', 'Đối tác',
        'Ngày nhận', 'Ngày giao hàng', 'Khách hàng trả',
        'Trả đối tác', 'Trả trước', 'Còn lại', 'Tỉ giá'
    ]

    const [checkedValues, setCheckedValues] = useState(defaultItemsTableColumn)
    const getValuesChecked = (checkedValues) => {
        setCheckedValues(checkedValues);
    };

    const resetDefalut = () => {
        setCheckedValues(defaultItemsTableColumn)
    }
    //Thêm hàng hóa
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [weight, setWeight] = useState(0)
    const [value, setvalue] = useState(0)
    const [selectedButton, setSelectedButton] = useState(null);
    const [price, setPrice] = useState("")
    const [fromDateAdd, setFromDateAdd] = useState("")
    const [note,setNote] = useState("")
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
        }, 2000);
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
            try {
                const response = await axios.get(`/api/khachhangs/${id}`)
                setFrom(response.data.transferFrom)
                setTo(response.data.transferTo)
            } catch(error) {
                console.log(error)
            }
        }
        getInfo()
    }, [id])

    const addItems = async () => {
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
        } catch(error) {
            console.log(error)
        }
      }
      
    return (
        <>
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
                <div className='border rounded-md'>
                    <DatePicker.RangePicker
                        onChange={handleDateChange}
                    />
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
                        { value: null, label: 'Tất cả' },
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
                                    style={{backgroundColor: tag.color}}
                                    className="absolute top-1/2 left-[3.5px] transform -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full">
                                </span>
                                {tag.name}
                            </CheckableTag>
                        ))}
                    </div>
                </div>

            </div>
            <div className="text-right relative bottom-[70px]">
                <Popover
                    trigger="click"
                    placement="bottom"
                    content=
                    {<div className="w-[200px] h-[350px] overflow-auto">
                        <button onClick={resetDefalut} className="text-indigo-700">Mặc định</button>
                        <Checkbox.Group
                            key={itemsTableColumn.value}
                            onChange={getValuesChecked}
                            className="flex flex-col"
                            options={itemsTableColumn}
                            defaultValue={defaultItemsTableColumn}
                        />
                    </div>}
                >
                    <Button className="border-none">Cột dữ liệu <CaretDownOutlined className="text-xs relative bottom-px right-2" /></Button>

                </Popover>
            </div>

            <table>
                <thead className="border-b">
                    <tr>
                        <th>STT</th>
                        {
                            checkedValues?.map((item, index) => {
                                return (
                                    <th className='px-4' key={index}>{item}</th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody className="border-b">
                    {
                        dataGoods.data?.map((item, index) => {
                            console.log(item.status)
                            return (
                                <tr className={selectStatus.length === 0 ? "border-b" :
                                               selectStatus.includes(1) ? "border-b bg-[#DFF0D8]":
                                               null
                                }>
                                    <td>{currentPage > 0 ? numberPage * (currentPage - 1) + index + 1 : index + 1}</td>
                                    {checkedValues?.map((i, index) => (
                                        <td className='px-4 py-4' key={index}>
                                            {   
                                                i === 'Khách hàng' ? <Link to='/' className="text-indigo-700">{item.customer.name}</Link> :
                                                i === 'Tên hàng hóa' ? <Link to='/' className="text-indigo-700">{item.name}</Link> :
                                                i === 'Đối tác' ? <Link to='/' className="text-indigo-700">{item.partner.name}</Link> :
                                                i === 'Cân nặng(KG)' ? <Link to='/' className="text-indigo-700">{item.weight}</Link> :
                                                i === 'Ngày nhận' ? item.fromDate :
                                                i === 'Ngày giao hàng' ? item.finishDelivery :
                                                i === 'Khách hàng trả' ? item.prepay :
                                                i === 'Trả đối tác' ? item.shipFee :
                                                i === 'Trả trước' ? item.prepay :
                                                i === 'Còn lại' ? item.value :
                                                i === 'Vị trí hiện tại' ? item.currentLocation :
                                                i === 'Gửi từ' ? item.from :
                                                i === 'Gửi đến' ? item.to :
                                                i === 'Cách trả phí' ? item.payType :
                                                i === 'Giá trị hàng' ? item.value :
                                                i === 'Trạng thái' ? (() => {
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
                                                i === 'Kho' ? <Link to='/' className="text-indigo-700">{item.warehouse.name}</Link> :
                                                i === 'Tỉ giá' ? item.price :
                                                null
                                            }
                                        </td>
                                    ))}

                                </tr>
                            )
                        })
                    }
                </tbody>
                <tfoot className="font-medium">
                    <tr>
                        <td>{dataGoods.count > 0 ? dataGoods.count : null}</td>
                    </tr>
                </tfoot>
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
        </>
    )
}

export default Items