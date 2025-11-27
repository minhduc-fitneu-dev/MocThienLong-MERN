import React, { useContext, useEffect } from "react";
import AccountSidebar from "../../components/AccountSidebar";
import { MyContext } from "../../App";
import MyListItems from "./myListItems";
import { Link } from "react-router-dom";

const MyList = () => {
  const context = useContext(MyContext);

  useEffect(() => {
    if (context.isLogin) {
      context.refreshMyList();
    }
  }, [context.isLogin]);

  return (
    <section className="py-10 w-full">
      <div className="container flex gap-5">
        <div className="col1 w-[20%]">
          <AccountSidebar />
        </div>

        <div className="col2 w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-5 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[20px] font-[600]">Danh sách yêu thích</h2>
              <p>
                Bạn có{" "}
                <span className="font-bold text-[#eb8600]">
                  {context.myListCount}
                </span>{" "}
                sản phẩm đã lưu
              </p>
            </div>

            {/* ❌ Chưa đăng nhập */}
            {!context.isLogin && (
              <div className="p-10 text-center">
                <img
                  src="/public/no-love.png"
                  className="w-[90px] opacity-70 mx-auto mb-5"
                />
                <h3 className="text-[18px] font-[600] mb-2">
                  Bạn chưa đăng nhập
                </h3>
                <p className="text-gray-500 mb-5">
                  Hãy đăng nhập để lưu lại các sản phẩm yêu thích của bạn!
                </p>
                <Link
                  to="/login"
                  className="btn-org px-6 py-2 rounded-md text-white font-[500]"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            )}

            {/* 📌 Đăng nhập rồi nhưng chưa có item */}
            {context.isLogin && context.myListItems.length === 0 && (
              <div className="p-10 text-center">
                <img
                  src="/public/no-love.png"
                  className="w-[90px] opacity-70 mx-auto mb-5"
                />
                <h3 className="text-[18px] font-[600] mb-2">
                  Bạn chưa lưu sản phẩm nào
                </h3>
                <p className="text-gray-500">
                  Hãy khám phá và lưu lại những sản phẩm bạn thích nhé!
                </p>
              </div>
            )}

            {/* 📌 Danh sách item */}
            {context.isLogin &&
              context.myListItems.map((item) => (
                <MyListItems key={item._id} data={item} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyList;
