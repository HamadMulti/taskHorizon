import Header from "./Header";
import Sidebar from "./SideNav";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="relative font-[sans-serif] pt-[70px] h-screen">
        <Header />

        <div>
          <div className="flex items-start">
            <Sidebar />
            <section className="main-content w-full overflow-auto p-6">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
