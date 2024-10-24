import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="App">
      <h1>Unofficial Google Fit web-based UI</h1>
      <Outlet />
    </div>
  )
};

export default Layout;





