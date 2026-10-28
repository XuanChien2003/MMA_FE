import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  deleteProduct,
  updateQuantity,
  resetCart,
  selectCartSummary,
} from "../redux/orebiSlices";

export default function useCart() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiSlices.products);
  const summary = useSelector(selectCartSummary);
  return {
    products,
    ...summary,
    addItem: (product, quantity = 1) => {
      const current =
        products.find((item) => item.productId === product.productId)
          ?.quantity || 0;
      if (
        Number.isFinite(product.countInStock) &&
        current + quantity > product.countInStock
      )
        return false;
      dispatch(addToCart({ ...product, quantity }));
      return true;
    },
    removeItem: (productId) => dispatch(deleteProduct(productId)),
    setQuantity: (productId, quantity) =>
      dispatch(updateQuantity({ productId, quantity })),
    clearCart: () => dispatch(resetCart()),
  };
}
