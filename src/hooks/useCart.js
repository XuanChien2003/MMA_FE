import { useDispatch, useSelector, useStore } from "react-redux";
import {
  addToCart,
  deleteProduct,
  updateQuantity,
  resetCart,
  selectCartSummary,
} from "../redux/orebiSlices";

export default function useCart() {
  const dispatch = useDispatch();
  const store = useStore();
  const products = useSelector((state) => state.orebiSlices.products);
  const summary = useSelector(selectCartSummary);
  return {
    products,
    ...summary,
    addItem: (product, quantity = 1) => {
      if (
        !product?.productId ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
      )
        return false;
      // Read the current store so consecutive presses do not share an old render.
      const current =
        store
          .getState()
          .orebiSlices.products.find(
            (item) => item.productId === product.productId,
          )?.quantity || 0;
      dispatch(addToCart({ ...product, quantity }));
      const updated =
        store
          .getState()
          .orebiSlices.products.find(
            (item) => item.productId === product.productId,
          )?.quantity || 0;
      return updated === current + quantity;
    },
    removeItem: (productId) => dispatch(deleteProduct(productId)),
    setQuantity: (productId, quantity) =>
      dispatch(updateQuantity({ productId, quantity })),
    clearCart: () => dispatch(resetCart()),
  };
}
