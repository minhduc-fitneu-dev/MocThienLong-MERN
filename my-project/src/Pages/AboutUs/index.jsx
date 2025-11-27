import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="about-page w-full bg-white text-gray-600">
      {/* SECTION 1 — HERO */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-[0.45] scale-105 transition-all duration-[2000ms]"
          style={{ backgroundImage: `url('/Aboutus.png')` }}
        ></div>

        <div className="relative text-center px-5" data-aos="fade-up">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-wide drop-shadow-xl">
            Về Mộc Thiên Long
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Nơi tinh hoa của nghệ thuật thủ công gỗ Việt được thổi hồn vào từng
            sản phẩm — sang trọng, bền vững và mang giá trị tinh thần sâu sắc.
          </p>
        </div>
      </section>

      {/* SECTION 2 — STORY */}
      <section className="container mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div
          className="w-full h-[380px] rounded-xl overflow-hidden shadow-lg"
          data-aos="zoom-in"
        >
          <img
            src="/Story.png"
            alt="Our Story"
            className="w-full h-full object-cover scale-105 hover:scale-110 transition-all duration-500"
          />
        </div>

        <div data-aos="fade-left">
          <h2 className="text-4xl font-bold mb-5 text-gray-800">
            Câu chuyện thương hiệu
          </h2>

          <p className="text-[17px] leading-relaxed mb-4 opacity-90">
            Mộc Thiên Long được tạo dựng từ niềm say mê dành cho nghệ thuật gỗ
            Việt Nam — nơi mỗi thớ gỗ mang trong mình một linh hồn, một câu
            chuyện và một vẻ đẹp nguyên bản.
          </p>

          <p className="text-[17px] leading-relaxed opacity-90">
            Chúng tôi hợp tác với những nghệ nhân lành nghề nhất, gửi trọn tâm
            huyết vào từng đường chạm khắc. Mỗi tác phẩm là sự kết hợp giữa kỹ
            thuật truyền thống và tinh thần hiện đại.
          </p>
        </div>
      </section>

      {/* SECTION 3 — VALUES */}
      <section className="bg-[#faf7f2] py-20 px-4">
        <div className="container mx-auto text-center mb-14" data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-3 text-gray-800">
            Giá trị chúng tôi theo đuổi
          </h2>
          <p className="max-w-2xl mx-auto text-[17px] opacity-80 leading-relaxed">
            Mỗi sản phẩm là sự giao hoà giữa nghệ thuật, chất lượng và tâm hồn
            của người nghệ nhân.
          </p>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Thủ công tinh xảo",
              text: "Từng đường nét được chạm khắc thủ công, mang lại độ sắc nét và giá trị thẩm mỹ vượt trội.",
            },
            {
              title: "Gỗ tự nhiên chọn lọc",
              text: "Sử dụng gỗ bền chắc, thân thiện môi trường và giữ nguyên vẻ đẹp tự nhiên của vân gỗ.",
            },
            {
              title: "Tinh thần văn hoá Việt",
              text: "Mỗi sản phẩm là một câu chuyện, chứa đựng tinh hoa văn hoá và triết lý truyền thống.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-7 bg-white rounded-xl shadow-md border hover:shadow-xl transition duration-300"
              data-aos="fade-up"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {item.title}
              </h3>
              <p className="opacity-80 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — GALLERY */}
      <section className="container mx-auto py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[5/4] rounded-xl overflow-hidden shadow-lg"
              data-aos="zoom-in-up"
            >
              <img
                src={`/box${i}-aboutus.png`}
                alt=""
                className="w-full h-full object-cover scale-105 hover:scale-110 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — MISSION */}
      <section className="bg-[#f8f4ef] py-20 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-4xl font-bold mb-5 text-gray-800">
              Sứ mệnh & định hướng
            </h2>
            <p className="text-[17px] leading-relaxed opacity-90 mb-4">
              Mộc Thiên Long mong muốn đưa những sản phẩm gỗ tinh xảo, sang
              trọng và bền vững đến mọi gia đình Việt.
            </p>
            <p className="text-[17px] leading-relaxed opacity-90">
              Chúng tôi hướng đến việc mở rộng danh mục sản phẩm, nâng cao trải
              nghiệm khách hàng và xây dựng thương hiệu gỗ Việt mang tầm quốc
              gia.
            </p>
          </div>

          <div
            className="w-full h-[380px] rounded-xl overflow-hidden shadow-lg"
            data-aos="zoom-in"
          >
            <img
              src="/Mission.png"
              alt="Mission"
              className="w-full h-full object-cover scale-105 hover:scale-110 transition-all duration-500"
            />
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA */}
      <section
        className="py-20 bg-gray-900 text-center text-white px-4"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-bold mb-4">
          Khám phá bộ sưu tập gỗ tinh hoa
        </h2>

        <p className="max-w-xl mx-auto text-[17px] mb-6 opacity-90 leading-relaxed">
          Từ tranh gỗ nghệ thuật đến vật phẩm phong thuỷ — chọn ngay món quà
          mang giá trị bền vững và tinh thần.
        </p>

        <a
          href="/"
          className="px-10 py-4 bg-[#eb8600] hover:bg-[#cc7400] rounded-full text-white font-semibold transition tracking-wide shadow-md"
        >
          Xem ngay
        </a>
      </section>
    </div>
  );
}
