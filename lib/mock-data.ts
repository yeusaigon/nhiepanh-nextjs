import { Album, Photo, SiteSettings } from "@/types";

export const MOCK_SETTINGS: SiteSettings = {
  site_name: "Nhiếp Ảnh Số",
  site_description: "Bộ sưu tập ảnh nghệ thuật - Nơi lưu giữ khoảnh khắc",
  logo_url: "",
  author_name: "Trí Phan",
  author_bio: "Nhiếp ảnh gia tự do, đam mê chụp ảnh đường phố và kiến trúc. Sáng tạo nên những câu chuyện qua ống kính.",
  author_avatar: "",
  author_social: { facebook: "", instagram: "", website: "" },
  copyright_text: "© 2026 Nhiếp Ảnh Số. Tất cả hình ảnh thuộc bản quyền của tác giả.",
  dmca_text: "Mọi hình ảnh trên trang đều được bảo vệ bản quyền. Vui lòng liên hệ trước khi sử dụng.",
  primary_color: "#f5f5f7",
  updated_at: "2026-06-01T00:00:00.000Z"
};

export const MOCK_ALBUMS: Album[] = [
  {
    id: "1", slug: "sai-gon-dem-hoa-le", title: "Sài Gòn Đêm Hoa Lệ",
    description: "Những góc phố lung linh ánh đèn về đêm giữa lòng thành phố năng động nhất Việt Nam.",
    content: "Sài Gòn về đêm khoác lên mình một vẻ đẹp hoàn toàn khác biệt. Từ những con phố tấp nập người qua lại, ánh đèn neon rực rỡ từ các tòa nhà cao tầng, đến những góc khuất yên bình bên dòng kênh Nhiêu Lộc.\n\nBộ ảnh này ghi lại những lát cắt cuộc sống về đêm của thành phố mang tên Bác. Mỗi khung hình là một câu chuyện riêng, một cảm xúc riêng về Sài Gòn - thành phố không bao giờ ngủ.",
    cover_image_url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    category: "street", tags: ["saigon", "night", "cityscape", "urban"],
    author: "Trí Phan", location: "TP. Hồ Chí Minh", date_taken: "2026-06-01",
    is_public: true, is_featured: true, pin: null,
    view_count: 1420, user_id: "demo",
    seo_title: "Sài Gòn Đêm Hoa Lệ", seo_description: "",
    created_at: "2026-06-01T20:00:00.000Z", updated_at: "2026-06-01T20:00:00.000Z"
  },
  {
    id: "2", slug: "ca-phe-bet-nguoi-sai-gon", title: "Cà Phê Bệt & Người Sài Gòn",
    description: "Nét văn hóa bình dị, mộc mạc bên hông Nhà thờ Đức Bà qua ống kính phim.",
    content: "Ngồi bệt trên vỉa hè, nhâm nhi ly cà phê sữa đá và ngắm dòng người qua lại là một nét văn hóa rất riêng của Sài Gòn. Không gian mở, không khoảng cách, tất cả cùng hòa vào nhịp sống chung.\n\nBộ ảnh ghi lại những khoảnh khắc đời thường nhất của người Sài Gòn bên ly cà phê - từ những cụ già đọc báo, đến các bạn trẻ trò chuyện rôm rả.",
    cover_image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    category: "street", tags: ["saigon", "coffee", "culture", "street"],
    author: "Trí Phan", location: "Quận 1, TP. HCM", date_taken: "2026-06-10",
    is_public: true, is_featured: true, pin: "1234",
    view_count: 852, user_id: "demo",
    seo_title: "Cà Phê Bệt & Người Sài Gòn", seo_description: "",
    created_at: "2026-06-10T08:30:00.000Z", updated_at: "2026-06-10T08:30:00.000Z"
  },
  {
    id: "3", slug: "dau-an-kien-truc-phap", title: "Dấu Ấn Kiến Trúc Pháp",
    description: "Khám phá vẻ đẹp cổ kính của Bưu điện Thành phố, Nhà hát Lớn và Dinh Độc Lập.",
    content: "Kiến trúc Pháp để lại dấu ấn sâu đậm trong lòng Sài Gòn. Những công trình như Bưu điện Trung tâm, Nhà hát Thành phố, Dinh Độc Lập... là minh chứng cho một thời kỳ lịch sử, đồng thời là những kiệt tác kiến trúc vượt thời gian.\n\nQua ống kính, tôi muốn tôn vinh vẻ đẹp vượt thời gian của những công trình này - từ những đường nét chạm khắc tỉ mỉ đến tổng thể kiến trúc hài hòa.",
    cover_image_url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&q=80",
    category: "architecture", tags: ["french", "architecture", "saigon", "heritage"],
    author: "Trí Phan", location: "Quận 1, TP. HCM", date_taken: "2026-06-15",
    is_public: true, is_featured: false, pin: null,
    view_count: 615, user_id: "demo",
    seo_title: "Dấu Ấn Kiến Trúc Pháp", seo_description: "",
    created_at: "2026-06-15T15:45:00.000Z", updated_at: "2026-06-15T15:45:00.000Z"
  },
  {
    id: "4", slug: "bien-vang-phu-quoc", title: "Biển Vàng Phú Quốc",
    description: "Hoàng hôn rực rỡ trên những bãi biển cát trắng, nước trong xanh của đảo ngọc.",
    content: "Phú Quốc không chỉ nổi tiếng với nước mắm và hồ tiêu mà còn là thiên đường biển đảo với những bãi cát trắng mịn trải dài, làn nước trong xanh màu ngọc bích.\n\nBộ ảnh tập trung vào khoảnh khắc hoàng hôn - thời khắc kỳ diệu nhất trong ngày khi mặt trời nhuộm vàng cả bầu trời và mặt biển.",
    cover_image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    category: "landscape", tags: ["phuquoc", "beach", "sunset", "seascape"],
    author: "Trí Phan", location: "Phú Quốc, Kiên Giang", date_taken: "2026-05-20",
    is_public: true, is_featured: true, pin: null,
    view_count: 2100, user_id: "demo",
    seo_title: "Biển Vàng Phú Quốc", seo_description: "",
    created_at: "2026-05-20T10:00:00.000Z", updated_at: "2026-05-20T10:00:00.000Z"
  },
  {
    id: "5", slug: "sac-mau-cho-noi-cai-rang", title: "Sắc Màu Chợ Nổi Cái Răng",
    description: "Phiên chợ trên sông độc đáo với hàng trăm ghe thuyền tấp nập mua bán lúc bình minh.",
    content: "Chợ nổi Cái Răng là một trong những khu chợ nổi lớn nhất đồng bằng sông Cửu Long. Từ sáng sớm, hàng trăm ghe thuyền đã tụ họp, treo những cây bẹo (cây sào treo hàng mẫu) để quảng cáo sản phẩm.\n\nSắc màu của trái cây, rau củ, hoa tươi... hòa quyện cùng ánh bình minh tạo nên khung cảnh sống động và đẹp mắt.",
    cover_image_url: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80",
    category: "travel", tags: ["cantho", "floatingmarket", "mekong", "river"],
    author: "Trí Phan", location: "Cần Thơ", date_taken: "2026-04-15",
    is_public: true, is_featured: false, pin: null,
    view_count: 1780, user_id: "demo",
    seo_title: "Sắc Màu Chợ Nổi Cái Răng", seo_description: "",
    created_at: "2026-04-15T05:00:00.000Z", updated_at: "2026-04-15T05:00:00.000Z"
  },
  {
    id: "6", slug: "net-dep-nghe-thuat-ba-le", title: "Vẻ Đẹp Nghệ Thuật Ba Lê",
    description: "Những chuyển động uyển chuyển và đầy cảm xúc của các vũ công ba lê dưới ánh đèn sân khấu.",
    content: "Ba lê là sự kết hợp hoàn hảo giữa thể thao và nghệ thuật. Những động tác tưởng chừng nhẹ nhàng nhưng đòi hỏi sức mạnh, sự dẻo dai và hàng nghìn giờ tập luyện.\n\nBộ ảnh ghi lại những khoảnh khắc đỉnh cao của nghệ thuật ba lê - nơi cơ thể con người đạt đến giới hạn của sự duyên dáng.",
    cover_image_url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=80",
    category: "portrait", tags: ["ballet", "dance", "art", "portrait"],
    author: "Trí Phan", location: "Nhà hát TP. HCM", date_taken: "2026-03-10",
    is_public: true, is_featured: true, pin: null,
    view_count: 3200, user_id: "demo",
    seo_title: "Vẻ Đẹp Nghệ Thuật Ba Lê", seo_description: "",
    created_at: "2026-03-10T18:00:00.000Z", updated_at: "2026-03-10T18:00:00.000Z"
  }
];

export const MOCK_PHOTOS: Record<string, Photo[]> = {
  "1": [
    { id: "p1", album_id: "1", image_url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=85", thumbnail_url: "", title: "Nhà Thờ Đức Bà rực rỡ", description: "Góc nhìn từ trên cao", alt_text: "Saigon Notre-Dame Basilica at night", display_order: 0, created_at: "2026-06-01T20:05:00.000Z" },
    { id: "p2", album_id: "1", image_url: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=1200&q=85", thumbnail_url: "", title: "Nhịp sống Nguyễn Huệ", description: "Phố đi bộ náo nhiệt", alt_text: "Nguyen Hue walking street", display_order: 1, created_at: "2026-06-01T20:10:00.000Z" },
    { id: "p3", album_id: "1", image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=85", thumbnail_url: "", title: "Bến Bạch Đằng lung linh", description: "Ánh đèn phản chiếu sông Sài Gòn", alt_text: "Bach Dang pier", display_order: 2, created_at: "2026-06-01T20:15:00.000Z" },
    { id: "p4", album_id: "1", image_url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=85", thumbnail_url: "", title: "Phố đêm Sài Gòn", description: "Góc phố về khuya", alt_text: "Saigon street at night", display_order: 3, created_at: "2026-06-01T20:20:00.000Z" },
  ],
  "2": [
    { id: "p5", album_id: "2", image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=85", thumbnail_url: "", title: "Cốc cà phê sữa đá buổi sáng", description: "Hương vị Sài Gòn", alt_text: "Vietnamese iced coffee", display_order: 0, created_at: "2026-06-10T08:35:00.000Z" },
    { id: "p6", album_id: "2", image_url: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=85", thumbnail_url: "", title: "Góc trò chuyện", description: "Câu chuyện bên ly cà phê", alt_text: "People chatting at cafe", display_order: 1, created_at: "2026-06-10T08:40:00.000Z" },
  ],
  "3": [
    { id: "p7", album_id: "3", image_url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=85", thumbnail_url: "", title: "Mặt tiền Bưu điện Thành phố", description: "Kiến trúc Phục Hưng tuyệt đẹp", alt_text: "Saigon Central Post Office", display_order: 0, created_at: "2026-06-15T15:50:00.000Z" },
    { id: "p8", album_id: "3", image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=85", thumbnail_url: "", title: "Nhà thờ Đức Bà", description: "Công trình biểu tượng Sài Gòn", alt_text: "Notre-Dame Cathedral Basilica", display_order: 1, created_at: "2026-06-15T15:55:00.000Z" },
    { id: "p9", album_id: "3", image_url: "https://images.unsplash.com/photo-1621155346337-1d19476ba7b0?w=1200&q=85", thumbnail_url: "", title: "Bên trong Bưu điện", description: "Trần vòm cao và cổ kính", alt_text: "Post office interior", display_order: 2, created_at: "2026-06-15T16:00:00.000Z" },
  ],
  "4": [
    { id: "p10", album_id: "4", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85", thumbnail_url: "", title: "Bãi Dài hoàng hôn", description: "Cát trắng, nắng vàng", alt_text: "Bai Dai sunset", display_order: 0, created_at: "2026-05-20T10:05:00.000Z" },
    { id: "p11", album_id: "4", image_url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=85", thumbnail_url: "", title: "Sóng vỗ bờ cát", description: "Nhịp sóng êm đềm", alt_text: "Waves on Phu Quoc beach", display_order: 1, created_at: "2026-05-20T10:10:00.000Z" },
    { id: "p12", album_id: "4", image_url: "https://images.unsplash.com/photo-1613939017364-f160eee2eb1e?w=1200&q=85", thumbnail_url: "", title: "Thuyền đánh cá", description: "Khung cảnh bình yên", alt_text: "Fishing boats", display_order: 2, created_at: "2026-05-20T10:15:00.000Z" },
  ],
  "5": [
    { id: "p13", album_id: "5", image_url: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1200&q=85", thumbnail_url: "", title: "Chợ nổi lúc bình minh", description: "Nhộn nhịp thuyền ghe", alt_text: "Floating market sunrise", display_order: 0, created_at: "2026-04-15T05:05:00.000Z" },
    { id: "p14", album_id: "5", image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=85", thumbnail_url: "", title: "Trái cây miệt vườn", description: "Sắc màu nhiệt đới", alt_text: "Tropical fruits on boat", display_order: 1, created_at: "2026-04-15T05:10:00.000Z" },
  ],
  "6": [
    { id: "p15", album_id: "6", image_url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200&q=85", thumbnail_url: "", title: "Bước nhảy hoàn hảo", description: "Khoảnh khắc đỉnh cao", alt_text: "Ballet dancer jump", display_order: 0, created_at: "2026-03-10T18:05:00.000Z" },
    { id: "p16", album_id: "6", image_url: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=1200&q=85", thumbnail_url: "", title: "Duyên dáng", description: "Đường cong nghệ thuật", alt_text: "Ballet pose", display_order: 1, created_at: "2026-03-10T18:10:00.000Z" },
  ]
};
