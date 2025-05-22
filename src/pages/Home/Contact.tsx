import React from "react";

const Contact: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="relative w-full h-[400px]">
        <img
          src="https://daihoc.fpt.edu.vn/wp-content/uploads/2025/01/header-2024-png.avif"
          alt="Banner Tiểu học FPT"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            LIÊN HỆ VỚI CHÚNG TÔI
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
        <h2 className="text-3xl font-bold mb-6">Trường Tiểu học FPT</h2>
        <div>
          <h3 className="text-xl font-semibold text-orange-600">TP. HỒ CHÍ MINH</h3>
          <p>
            Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh
          </p>
          <p>Điện thoại: (028) 7300 5588</p>
          <p>Email: tieuhoc.hcm@fpt.edu.vn</p>
        </div>
      </div>

      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="w-full h-80">
            <iframe
              title="Trường Tiểu học FPT"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105376067!2d106.80730271139373!3d10.84112758926702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1747936599058!5m2!1svi!2s"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;