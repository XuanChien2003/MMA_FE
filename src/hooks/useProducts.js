import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProducts } from "../services/productService";

export default function useProducts(query = "", fetchPage = fetchProducts) {
  const sessionRef = useRef(null);
  const [state, setState] = useState({
    products: [],
    total: 0,
    loading: true,
    error: "",
  });

  const load = useCallback(
    async (session, reset = false) => {
      if (
        sessionRef.current !== session ||
        session.busy ||
        (!reset && session.done)
      ) {
        return;
      }
      session.busy = true;
      session.retryReset = reset;
      session.controller = new AbortController();
      setState((prev) => ({ ...prev, loading: true, error: "" }));

      try {
        const result = await fetchPage({
          query: session.query,
          skip: reset ? 0 : session.skip,
          signal: session.controller.signal,
        });

        if (sessionRef.current !== session) return;

        session.skip = (reset ? 0 : session.skip) + result.products.length;
        session.done =
          session.skip >= result.total || result.products.length === 0;
        session.retryReset = false;

        setState((prev) => {
          const merged = reset
            ? result.products
            : [...prev.products, ...result.products];
          // Deduplicate by productId
          const unique = Array.from(
            new Map(merged.map((p) => [p.productId, p])).values(),
          );
          return {
            products: unique,
            total: result.total,
            loading: false,
            error: "",
          };
        });
      } catch (err) {
        if (
          sessionRef.current === session &&
          !session.controller.signal.aborted
        ) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Không thể tải sản phẩm. Vui lòng kiểm tra kết nối mạng và thử lại.",
          }));
        }
      } finally {
        session.busy = false;
      }
    },
    [fetchPage],
  );

  useEffect(() => {
    const session = {
      query: (query || "").trim(),
      skip: 0,
      done: false,
      busy: false,
    };
    sessionRef.current = session;
    setState({ products: [], total: 0, loading: true, error: "" });
    load(session, true);

    return () => {
      sessionRef.current = null;
      session.controller?.abort();
    };
  }, [query, load]);

  const loadMore = useCallback(() => {
    const session = sessionRef.current;
    if (session) {
      load(session, session.retryReset === true);
    }
  }, [load]);

  const refresh = useCallback(() => {
    const session = {
      query: (query || "").trim(),
      skip: 0,
      done: false,
      busy: false,
    };
    sessionRef.current = session;
    load(session, true);
  }, [query, load]);

  return {
    ...state,
    loadMore,
    refresh,
    hasMore: state.products.length < state.total && !sessionRef.current?.done,
  };
}
