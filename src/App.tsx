import Navbar from "./componentes/organismos/Navbar";
import Footer from "./componentes/organismos/Footer";
import Login from "./paginas/Login";
import { Routes, Route } from "react-router-dom";

function App(){
  return(
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={<Login />}/>
//aqui deberia seguir el resto de las rutas
      </Routes>
      <Footer />
    </>
  )
}
export default App;