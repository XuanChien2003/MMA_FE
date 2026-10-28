import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  deleteProduct,
  updateQuantity,
  clearCart,
  selectCartSummary,
} from "../redux/cartSlice";

export default function useCart() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products);
  const { itemCount, totalPrice } = useSelector(selectCartSummary);

  const addItem = (product, quantity = 1) => {
    if (!product?.productId && !product?.id) return false;
    const itemToAdd = {
      productId: String(product.productId || product.id),
      name: product.name || product.title,
      title: product.title || product.name,
      price: Number(product.price),
      image: product.image || product.thumbnail || "",
      currency: product.currency || "USD",
      quantity: Number(quantity) || 1,
    };
    dispatch(addToCart(itemToAdd));
    return true;
  };

  const removeItem = (productId) => {
    dispatch(deleteProduct(String(productId)));
  };

  const setQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId: String(productId), quantity }));
  };

  const resetCart = () => {
    dispatch(clearCart());
  };

  return {
    products,
    itemCount,
    totalPrice,
    addItem,
    removeItem,
    setQuantity,
    clearCart: resetCart,
  };
}
