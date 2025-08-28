import { useState, useTransition, useOptimistic } from "react";
import toast, { Toaster } from "react-hot-toast";

function Formulir({ onAdd }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama")?.trim();
    const email = formData.get("email")?.trim();

    if (!nama) {
      toast.error("Nama wajib diisi!");
      return;
    }
    if (!email || !email.includes("@")) {
      toast.error("Email tidak valid!");
      return;
    }

    startTransition(() => {
      onAdd({ nama, email });
      toast.success("Pendaftaran berhasil!");
      e.currentTarget.reset();
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Formulir Pendaftaran</h2>
      <input type="text" name="nama" placeholder="Nama" />
      <input type="email" name="email" placeholder="Email" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Daftar"}
      </button>
    </form>
  );
}

function DaftarPeserta({ peserta }) {
  return (
    <div className="peserta">
      <h3>Daftar Peserta</h3>
      <ul>
        {peserta.map((p, idx) => (
          <li key={idx}>
            {p.nama} ({p.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [peserta, setPeserta] = useState([]);
  const [optimisticPeserta, addOptimisticPeserta] = useOptimistic(peserta);

  const handleAdd = (baru) => {
    // Optimistic update
    addOptimisticPeserta([...optimisticPeserta, baru]);

    // Simulasi delay server
    setTimeout(() => {
      setPeserta((prev) => [...prev, baru]);
    }, 500);
  };

  return (
    <div className="container">
      <Formulir onAdd={handleAdd} />
      <DaftarPeserta peserta={optimisticPeserta} />
      <Toaster position="top-right" />
    </div>
  );
}
