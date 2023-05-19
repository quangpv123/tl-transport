import './App.css';
import Form from './login/Form'
import Nav from './nav/nav';


function App() {
   let cookie = document.cookie
   if (!cookie.includes("PHPSESSID")){
    return (
      < Form />
    )
   } else {
    return (
      <>
      < Nav />
      </>
    )
   }
}

export default App