import { useCallback, useEffect, useState } from "react";
import { deleteTransaction, getTransactions } from "../services/api";
export function useTransactions(params = {}) {
  const [data, setData] = useState({ items: [], total: 0, totals: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => { setLoading(true); try { setData(await getTransactions(params)); setError(""); } catch { setError("Tidak dapat memuat transaksi."); } finally { setLoading(false); } }, [JSON.stringify(params)]);
  useEffect(() => { reload(); }, [reload]);
  const remove = async (id) => { await deleteTransaction(id); await reload(); };
  return { ...data, loading, error, reload, remove };
}
