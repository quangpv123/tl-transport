import { useContext, useState } from 'react'
import axios from 'axios'
import Select from 'react-select';

import './AddCustomer.css'
import './ListCustomers'
import DataContext from './DataContext';


function AddCustomer ({handleShowForm}){

    const dataParents = useContext(DataContext).dataParents

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
    
    
        const upInfoCustomer = async () => {
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
          } catch (error) {
            console.error(error);
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

        
 
    return(
        <>
        <div className="modalOverlay absolute w-full h-full bg-black/20"></div>
        <div className="modalBody h-[500px] w-11/12 max-w-[600px] bg-white mx-auto mt-24 z-10">
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
                            onChange={e => setName(e.target.value)}
                            name="name" placeholder="Tên" 
                            className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green" 
                            data-gtm-form-interact-field-id="4">
                        </input>
                    </div>
                    <div className="grid grid-cols-[130px_1fr] mt-5">
                        <div className="flex items-center justify-start ml-4">Số điện thoại</div>
                        <input 
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
                                options={[
                                    { value: null, label: "-----" },
                                    ...dataParents?.map((item) => ({ value: item.id, label: item.name }))
                                  ]}
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
                                onChange={e => setTransferFrom(e.target.value)}
                                name="transferFrom" placeholder="Từ" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green border-red"></input>
                            <div 
                                onChange={e => setTransferTo(e.target.value)}
                                className="pl-2">_</div>
                            <input 
                                onChange={e => setTransferTo(e.target.value)}
                                name="transferTo" placeholder="Đến" className="mr-4 numberInput border border-gray-300 text-sm block p-1.5 rounded-sm outline-green"></input>
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