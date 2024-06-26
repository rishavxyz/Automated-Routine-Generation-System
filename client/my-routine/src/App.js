import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Credits from "./pages/Credits";
import Display from "./pages/Display";
import Form from "./pages/Form";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import Routines from "./pages/Routines";
import Footer from "./components/Footer";
import SlotForm from "./pages/SlotForm";
import { FormDataProvider } from "./context/FormDataContext";
import ResourceScheduler from "./pages/ResourceScheduler";

function App() {
  return (
    <div className="App">
      <Router>
        <FormDataProvider>
          <div>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/slotform" element={<SlotForm />} />
              <Route path="/form" element={<Form />} />
              <Route path='/resource_pref' element = {<ResourceScheduler/>} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/routines" element={<Routines />} />
              <Route path="/display" element={<Display />} />
              <Route path="/credits" element={<Credits />} />
            </Routes>
            <Footer />
          </div>
        </FormDataProvider>
      </Router>
    </div>
  );
}

export default App;
