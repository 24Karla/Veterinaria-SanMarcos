import Navbar from "./componentes/organismos/Navbar";
import Footer from "./componentes/organismos/Footer";
import Login from "./paginas/Login";
import { Routes, Route } from "react-router-dom";

function App(){
  return(
    <div className="d-flex flex-column" style={{ minHeight: "100vh", backgroundColor: "#f5f0e8 " }}>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={<Login />}/>
//aqui deberia seguir el resto de las rutas
      </Routes>
      <Footer />
    </div>
  )
}
export default App;