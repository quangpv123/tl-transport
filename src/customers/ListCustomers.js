import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCustomer from './AddCustomer'
import DataContext from './DataContext';
import ReactPaginate from "react-paginate";
import { Link } from 'react-router-dom';


function Customers() {

  const [data, setData] = useState([]);
  const [numberPage, setNumberPage] = useState(20);
  const [dataParents, setDataParents] = useState([]);
  const [count, setCount] = useState("")
  const [valueSeach, setValueSerch] = useState("")
  const [buttonTotal, setButtonTotal] = useState("")
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/khachhangs', {
          params:
          {
            page: currentPage,
            numberpage: numberPage
          }
        });
        setData(response.data.data);
        setCount(response.data.count)
        setDataParents(response.data.parents)
        setButtonTotal(Math.ceil(response.data.count / numberPage))
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [numberPage, currentPage])

  const handleSelectChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setNumberPage(selectedValue);
  };
  //Show table add customer
  const [showForm, setShowForm] = useState(false)
  const handleShowForm = (value) => {
    setShowForm(value)
  }

  //Search
  const searchData = async () => {
    try {
      const response = await axios.get('/api/khachhangs', {
        params:
        {
          page: 1,
          numberpage: numberPage,
          search: valueSeach
        }
      });
      setData(response.data.data);
      setCount(response.data.count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchData();
    }
  };

//Button select page
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected+1);
    
  };

  return (
    <DataContext.Provider value={{data, dataParents}}>
      <div className="w-10/12 max-w-[1024px] mt-[90px] mx-auto px-8">
        <div className="flex justify-between">
          <div className="flex">
            <h1 className="font-normal text-2xl">Danh sách khách hàng</h1>
            <span onClick={handleShowForm} className="mt-2 ml-2.5 cursor-pointer">
              <svg id="addCustomer" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" color="#337ab7" className="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z">
                </path>
              </svg>
            </span>
          </div>
          <div>
            <input
              onChange={e => setValueSerch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="outline-blue-400 border border-gray-300 rounded-sm w-[450px] h-9 float-right pl-2 text-sm"
              placeholder="Tìm kiếm khách hàng"
            ></input>
          </div>
        </div>
        <table className="w-full text-left text-sm mt-5">
          <thead className="text-sm border-b">
            <tr>
              <th scope="col" className="px-2 py-2 text-left font-medium w-[11%]">STT</th>
              <th scope="col" className="px-6 py-2 text-left font-medium w-[43%]">Họ và tên</th>
              <th scope="col" className="px-6 py-2 text-left font-medium w-[25%]">Số điện thoại</th>
              <th scope="col" className="px-6 py-2 text-left font-medium">Dư nợ (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="px-2 py-2">{item.id}</td>
                    <td className="px-6 py-2">
                      <Link className="text-indigo-400" to={`/customers/${item.id}`}>
                        <span>{item.name}</span>
                      </Link>  
                    </td>
                    <td className="px-6 py-2">{item.mobile}</td>
                    <td className="px-6 py-2">
                      <p className={item.debt > 0 ? "text-[green]" : item.debt < 0 ? "text-[red]" : "text-black"}
                      >{new Intl.NumberFormat().format(item.debt)}</p>
                    </td>
                  </tr>
                );
              })
            }

          </tbody>
        </table>
        <div className="bg-white hidden-btn font-bold py-2">
          <p className="pl-2">{count}</p>
        </div>
        <div className="flex items-center text-sm justify-between border-gray-200 bg-white py-3 sm:px-0">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >Next</button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex">
              <p className="text-sm text-gray-700 mr-3 mt-[1px]">Kích thước trang:</p>
              <select
                value={numberPage}
                onChange={handleSelectChange}
                className="border border-[#333] w-[100px]">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
              </select>
            </div>
            <div className="">
            <ReactPaginate
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
            />
            </div>
          </div>
        </div>
      </div>
      <div className={showForm ? "modal flex fixed top-0 right-0 bottom-0 left-0" : "hidden"}> <AddCustomer handleShowForm={handleShowForm} /></div>
    </DataContext.Provider>
  )
}



export default Customers