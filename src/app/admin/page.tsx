"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@stackframe/stack";


// const mockStocks = [
//     { symbol: 'AAPL', name: 'Apple Inc.' },
//     { symbol: 'TSLA', name: 'Tesla Inc.' },
//     { symbol: 'GOOG', name: 'Alphabet Inc.' },
//     { symbol: 'NFLX', name: 'Netflix Inc.' },
//     { symbol: 'AMZN', name: 'Amazon.com Inc.' },
// ];

export default function AdminDashboardPage() {
  const user = useUser();
  const id = user?.id; // Extract the user's id
  const [role, setRole] = useState<string | null>(null); // State to store the user's role

  const [users, setUsers] = useState<{ email: string, role: string }[]>([]);
  const [stocks, setStocks] = useState<{  name: string, symbol: string }[]>([]);
  const [stockName, setStockName] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');


  // stock ticker values
  // Citibank - C
  // JP Morgan Chase - JPM
// Goldman Sachs - GS
// AMD - AMD

  const addStock = async () => {
    if (stockSymbol && stockName) {
        try {
            let data_populated = false;
            const historicalResponse = await axios.get(`/api/fetchHistoricalData`, {
                params: { symbol: stockSymbol },
            });

            if (historicalResponse.status === 200) {
                console.log('Historical data fetched successfully');
                data_populated = true;
            }

            const response = await axios.post('/api/addStock', {
              name: stockName,
              symbol: stockSymbol,
              data_populated: data_populated, // Pass the data_populated flag
            });
      
            if (response.status === 200) {
              setStocks([...stocks, { symbol: stockSymbol, name: stockName }]); // Update local state
              setStockSymbol('');
              setStockName('');
              console.log('Stock added successfully');
            } else {
              console.error('Failed to add stock');
            }
          } catch (error) {
            console.error('Error adding stock:', error);
        }
    }
  };

  const makeAdmin = async (email: string) => {
    try {
        await axios.post('/api/makeAdmin', { email });
        setUsers(users.map((u) => (u.email === email ? { ...u, role: 'admin' } : u))); // Update the local state
      } catch (error) {
        console.error('Error making user admin:', error);
      }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/getUsers');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

    // to make sure only admins can access this page
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

    useEffect(() => {
        const fetchStocks = async () => {
            try {
            const response = await axios.get('/api/getStockList'); // Fetch stocks from the API
            setStocks(response.data); // Set the stocks state with the fetched data
            } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    fetchStocks();
    }, []);

  if (!user || role !== 'admin') {
    return <p>Access denied. You must be an admin to view this page.</p>;
  }

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