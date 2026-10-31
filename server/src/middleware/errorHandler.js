export function errorHandler(error, req, res, next) {
  if (error.name === "ZodError") return res.status(400).json({ error: "Input tidak valid", details: error.issues });
  if (error.code === "P2025") return res.status(404).json({ error: "Transaksi tidak ditemukan" });
  console.error(error);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
}
