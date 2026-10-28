import { useCallback, useEffect, useRef, useState } from "react";
import { fetchShopProducts } from "../services/shopCatalog";

export default function useProducts(query, fetchPage = fetchShopProducts) {
  const sessionRef = useRef(null);
  const [state, setState] = useState({
    products: [],
    total: 0,
    loading: true,
    refreshing: false,
    error: "",
    stale: false,
  });

  const load = useCallback(
    async (session, reset = false, fresh = false) => {
      if (
        sessionRef.current !== session ||
        session.busy ||
        (!reset && session.done)
      )
        return;
      session.busy = true;
      session.retryReset = reset;
      session.controller = new AbortController();
      setState((previous) => ({
        ...previous,
        error: "",
        loading: true,
        refreshing: reset && fresh,
      }));
      try {
        const result = await fetchPage({
          query: session.query,
          skip: reset ? 0 : session.skip,
          signal: session.controller.signal,
          fresh,
        });
        if (sessionRef.current !== session) return;
        session.skip = (reset ? 0 : session.skip) + result.products.length;
        session.done =
          session.skip >= result.total || result.products.length === 0;
        session.retryReset = false;
        setState((previous) => {
          const products = reset
            ? result.products
            : [...previous.products, ...result.products];
          return {
            products: [
              ...new Map(
                products.map((product) => [product.productId, product]),
              ).values(),
            ],
            total: result.total,
            stale: Boolean(result.stale) || (!reset && previous.stale === true),
            error: "",
            loading: false,
            refreshing: false,
          };
        });
      } catch (error) {
        if (
          sessionRef.current === session &&
          !session.controller.signal.aborted
        ) {
          setState((previous) => ({
            ...previous,
            loading: false,
            refreshing: false,
            error: "Không thể tải sản phẩm. Kiểm tra kết nối và thử lại.",
          }));
        }
      } finally {
        session.busy = false;
      }
    },
    [fetchPage],
  );

  useEffect(() => {
    const session = { query: query.trim(), skip: 0, done: false, busy: false };
    sessionRef.current = session;
    setState({
      products: [],
      total: 0,
      loading: true,
      refreshing: false,
      error: "",
      stale: false,
    });
    load(session, true);
    return () => {
      const activeSession = sessionRef.current;
      sessionRef.current = null;
      activeSession?.controller?.abort();
    };
  }, [query, load]);

  const loadMore = useCallback(() => {
    const session = sessionRef.current;
    if (session)
      return load(
        session,
        session.retryReset === true,
        session.retryReset === true,
      );
  }, [load]);
  const refresh = useCallback(() => {
    const old = sessionRef.current;
    if (!old) return;
    old.controller?.abort();
    const session = { query: old.query, skip: 0, done: false, busy: false };
    sessionRef.current = session;
    return load(session, true, true);
  }, [load]);

  return {
    ...state,
    loadMore,
    refresh,
    hasMore: state.products.length < state.total && !sessionRef.current?.done,
  };
}
