import { RootState } from "../../app/store";
import Header from "./Header";
import Sidebar from "./SideNav";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <>
      <div className="relative font-[sans-serif] pt-[70px] h-screen">
        <Header user={user} loading={loading} error={error} />

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
