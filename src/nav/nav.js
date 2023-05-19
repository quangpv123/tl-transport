import { Routes, Route, Link } from 'react-router-dom'
import Logout from '../logout/logout'
import RouteItems from '../router/router'


function Nav() {
  return (
    <>
      <div id="nav" className="flex justify-between h-[53px] mx-auto mp-5 bg-amber-50 w-10/12 border rounded-md border-[f8f8f8] mt-[-2px] max-w-[1124px]">
        <div>
          <img src="https://transport-old.techlead.vn/assets/images/logo.png" alt="TechLead"
            className="h-[20px] mt-4 ml-4"
          />
        </div>
        <div id="listnav" className='flex'>
          <div className='navItem'> <Link to="/">Hàng Hóa</Link> </div>
          <div className='navItem'> <Link to="/">Tiến trình vận chuyển</Link> </div>
          <div className='navItem'> <Link to="/">Đối tác</Link> </div>
          <div className='navItem'> <Link to="/customers">Khách Hàng</Link> </div>
          <div className='navItem'> <Link to="/">Kho</Link> </div>
          <div className='navItem'> <Link to="/">Settings</Link> </div>
          <div className='navItem'> <Link to="/">Báo cáo</Link> </div>
          < Logout />
        </div>
      </div>
      <Routes>
        < Route path="/customers/*" element={<RouteItems/>}>
        </Route>
      </Routes>

    </>
  )
}

export default Nav