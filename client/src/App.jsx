import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("senactivity-dark") === "true");
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); localStorage.setItem("senactivity-dark", dark); }, [dark]);
  return <BrowserRouter><Layout dark={dark} setDark={setDark}><Routes><Route path="/" element={<Dashboard/>}/><Route path="/income" element={<Transactions type="INCOME"/>}/><Route path="/expense" element={<Transactions type="EXPENSE"/>}/><Route path="/transactions" element={<Transactions/>}/><Route path="/reports" element={<Reports/>}/><Route path="/settings" element={<div className="card"><h1 className="text-2xl font-bold">Pengaturan</h1><p className="mt-2 text-sm text-slate-500">Preferensi aplikasi akan tersedia di sini.</p></div>}/></Routes></Layout></BrowserRouter>;
}
