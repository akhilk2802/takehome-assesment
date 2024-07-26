import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CompanyList from "./components/CompanyList";
import CompanyDetails from "./components/CompanyDetails";
import Home from "./components/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" exact Component={Home} />
          <Route path="/companyList" Component={CompanyList} />
          <Route path="/companyDetails/:id" Component={CompanyDetails} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
