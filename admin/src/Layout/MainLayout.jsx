import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useContext } from "react";
import { MyContext } from "../App";

export default function MainLayout({ children }) {
  const { isSidebarOpen } = useContext(MyContext);
  
  return (
    <section className="main">
      <Header />
      <div className="contentMain flex">
        <div
          className={`sidebarWrapper ${
            isSidebarOpen ? "w-[18%]" : "w-[0px] opacity-0"
          } transition-all`}
        >
          <Sidebar />
        </div>
        
        <div
          className={`contentRight py-4 px-5 ${
            isSidebarOpen ? "w-[81%]" : "w-[100%]"
          } transition-all`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
