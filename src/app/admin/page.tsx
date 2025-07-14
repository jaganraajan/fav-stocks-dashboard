"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@stackframe/stack";

const mockUsers = [
    { email: 'admin@example.com', role: 'admin' },
    { email: 'user1@example.com', role: 'user' },
    { email: 'user2@example.com', role: 'user' },
    { email: 'manager@example.com', role: 'manager' },
];

const mockStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'GOOG', name: 'Alphabet Inc.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
];

export default function AdminDashboardPage() {
  const user = useUser();
  const id = user?.id; // Extract the user's id
  const [role, setRole] = useState<string | null>(null); // State to store the user's role

  const [users, setUsers] = useState<{ email: string, role: string }[]>(mockUsers);
  const [stocks, setStocks] = useState<{ symbol: string, name: string }[]>(mockStocks);
  const [stockName, setStockName] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');

  const addStock = () => {
    if (stockSymbol && stockName) {
      setStocks([...stocks, { symbol: stockSymbol, name: stockName }]);
      setStockSymbol('');
      setStockName('');
    }
  };

  const makeAdmin = (email: string) => {
    setUsers(users.map(u => (u.email === email ? { ...u, role: 'admin' } : u)));
  };

//   useEffect(() => {
//     if (!user || user.role !== "admin") return;
//     // Fetch users
//     axios.get('/api/admin/users', { headers: { 'x-user-id': user.primaryEmail } })
//       .then(res => setUsers(res.data));
//     // Fetch stocks
//     axios.get('/api/admin/stocks', { headers: { 'x-user-id': user.primaryEmail } })
//       .then(res => setStocks(res.data));
//   }, [user]);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (!id) return;

            try {
                const response = await axios.get('/api/getUserRole', {
                params: { id },
                });
                setRole(response.data.role); // Set the role state
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, [id]);

  if (!user || role !== 'admin') {
    return <p>Access denied. You must be an admin to view this page.</p>;
  }

//   const promoteUser = (email: string) => {
//     axios.post('/api/admin/users', { email, role: 'admin' }, { headers: { 'x-user-id': user.primaryEmail } })
//       .then(() => window.location.reload());
//   };

//   const addStock = async () => {
//     await axios.post('/api/admin/stocks', { symbol: stockSymbol, name: stockName }, { headers: { 'x-user-id': user.primaryEmail } });
//     setStockSymbol('');
//     setStockName('');
//     window.location.reload();
//   };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email}>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.role}</td>
                <td className="border px-4 py-2">
                  {u.role !== 'admin' && (
                    <button className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => makeAdmin(u.email)}>
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Manage Stocks</h2>
        <form className="mb-4 flex gap-2" onSubmit={e => { e.preventDefault(); addStock(); }}>
          <input value={stockSymbol} onChange={e => setStockSymbol(e.target.value)} placeholder="Symbol" className="border px-2 py-1" />
          <input value={stockName} onChange={e => setStockName(e.target.value)} placeholder="Name" className="border px-2 py-1" />
          <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">Add Stock</button>
        </form>
        <ul>
          {stocks.map(s => (
            <li key={s.symbol}>
              {s.symbol} - {s.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}