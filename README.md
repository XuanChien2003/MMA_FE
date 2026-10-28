# MMA Store — Assignment 2 Frontend

Expo SDK 58, React Native và React Native Web. Giao diện thích ứng desktop/iPhone dùng font Be Vietnam Pro lưu trong `assets/fonts` và bộ màu tại `src/theme/storefront.js`.

```powershell
npm ci
npm start
```

Mở `http://localhost:8081` để xem web, hoặc dùng Camera iPhone quét QR và mở Expo Go. Máy tính và iPhone cần cùng Wi-Fi.

Backend mặc định là IP máy chạy Expo, cổng 9999. Nếu backend chạy riêng hoặc trên Render, đặt `EXPO_PUBLIC_API_URL` trong `.env.local` rồi khởi động lại Expo. Có thể dùng `npm run web` để khởi động bản web.

Ứng dụng chỉ gồm ba màn theo đề: danh sách sản phẩm, chi tiết và giỏ hàng. Đã bỏ tài khoản, đặt hàng, thanh toán và quản trị ngoài phạm vi.

Nguồn công khai: https://shoptaycam.com/wp-json/wc/store/v1/products. Backend chuyển tiếp phân trang và tìm kiếm vì nguồn không cho trình duyệt gọi trực tiếp qua CORS. Giá và tình trạng có hàng được tải từ nguồn; giao diện thông báo khi phải dùng bản lưu do nguồn tạm lỗi.

- `src/Screens/Home.js`: ProductListScreen; tìm kiếm, bộ lọc, FlatList với onEndReached, kéo làm mới và tải thêm.
- `src/Screens/ProductDetails.js`: ProductDetailScreen; tên, ảnh, gallery, mô tả, giá và thêm vào giỏ.
- `src/Screens/Cart.js`: CartScreen; xóa sản phẩm, tăng/giảm số lượng, tổng tiền và số lượng cập nhật ngay.
- `src/hooks/useCart.js` và Redux quản lý giỏ; AsyncStorage giữ giỏ khi đóng app.
- Các component dùng lại: ProductCard, CartItem, PriceSummary, ProductImage. Có ActivityIndicator, lỗi/thử lại, trạng thái trống và TouchableOpacity cho thẻ sản phẩm.

Giao diện áp dụng [claude-design](https://github.com/jiji262/claude-design-skill): xanh rừng, trắng ngà, ảnh sản phẩm thật và font Be Vietnam Pro. Lưới 1–4 cột, chi tiết và giỏ hàng hai cột trên desktop; token tại `src/theme/storefront.js`.

Kiểm tra bundle: `npx expo export --platform ios --platform web --max-workers 2`. Giá và ảnh phục vụ bài tập, không phải cam kết bán hàng của MMA Store.

Không đưa `.env`, `node_modules` hay thông tin đăng nhập lên Git. Giấy phép font nằm tại `assets/fonts/OFL.txt`.
