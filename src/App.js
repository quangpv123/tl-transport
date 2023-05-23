import './App.css';
import Form from './login/Form'
import Nav from './nav/nav';


function App() {
   if (!document.cookie.includes("PHPSESSID")){
    return (
      < Form />
    )
   } else {
    return (
      < Nav />
    )
   }
}

export default App