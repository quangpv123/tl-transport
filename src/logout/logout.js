import Cookies from "js-cookie";
import { useState, useEffect} from "react"

function Logout () {
    const [btnLogout, setBtnLogout] = useState(false);

    const handleShowLogout = () => {
        setBtnLogout(true);
    };
    
    const handleClick = (event) => {
        const target = event.target;
        const logoutContainer = document.querySelector(".relative");
    
        if (!logoutContainer.contains(target)) {
          setBtnLogout(false);
        }
      };
    
    useEffect(() => {
        document.addEventListener("click", handleClick);
    
        return () => {
          document.removeEventListener("click", handleClick);
        };
    }, []);  
    
    const handleLogout = () => {
        Cookies.remove('PHPSESSID')
        window.location.reload()
    }

    return (
    <div onClick={handleShowLogout} className="relative">
        <div className="navItem w-fit py-4 px-3 hover:text-[#333]">    
            <div className="ant-space css-1km3mtt ant-space-horizontal ant-space-align-center">
                <div className="ant-space-item">
                    <span className="flex">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em"s width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z">
                        </path>
                        </svg>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z">
                        </path>
                        <path d="M7 10l5 5 5-5z"></path>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
        <div className={btnLogout ? "absolute w-[120px] border top-[60px] right-[10px] bg-white py-[10px]" : "hidden"}>
            <button className="hover:bg-slate-200 py-1 w-10/12 text-left ml-2.5 rounded">User</button>
            <button className="hover:bg-slate-200 py-1 w-10/12 text-left ml-2.5 rounded">User Settings</button>
            <button onClick={handleLogout} className="hover:bg-slate-200 py-1 w-10/12 text-left ml-2.5 rounded">Log out</button>
        </div>
    </div>
    )
}

export default Logout