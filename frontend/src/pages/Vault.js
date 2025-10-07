import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ Use context
import { useVault } from '../hooks/useVault';
import PasswordGenerator from '../components/PasswordGenerator';

const Vault = () => {
  const { password, logout } = useAuth(); // ✅ Global password
  const { vault, searchQuery, loading, addItem, updateItem, deleteItem, search, clearSearch } = useVault(password); // ✅ Simplified (token via auth header)
  const [newItem, setNewItem] = useState({ title: '', username: '', password: '', url: '', notes: '' });
  const [editId, setEditId] = useState(null);
  const [editingItem, setEditingItem] = useState({});

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(newItem);
    setNewItem({ title: '', username: '', password: '', url: '', notes: '' });
  };

  const handleEdit = (id) => {
    const item = vault.find((i) => i._id === id);
    setEditingItem({ ...item });
    setEditId(id);
  };

  const saveEdit = () => {
    updateItem(editId, editingItem);
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setTimeout(() => navigator.clipboard.writeText(''), 15000);
  };

  if (loading || !password) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Loading vault...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Vault ({vault.length} items)</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <PasswordGenerator onGenerate={(genPass) => setNewItem({ ...newItem, password: genPass })} />

      <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
        <input
          placeholder="Title *"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          className="w-full p-3 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <input
          placeholder="Username"
          value={newItem.username}
          onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
          className="w-full p-3 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          placeholder="Password"
          value={newItem.password}
          onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
          className="w-full p-3 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          placeholder="URL (optional)"
          value={newItem.url}
          onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
          className="w-full p-3 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <textarea
          placeholder="Notes (optional)"
          value={newItem.notes}
          onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
          className="w-full p-3 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600"
          rows="3"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Save Item
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or URL..."
          value={searchQuery}
          onChange={(e) => search(e.target.value)}
          className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="mt-2 text-blue-500 hover:underline">
            Clear Search
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {vault.map((item) => (
          <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {editId === item._id ? (
              <div>
                <input
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="Title"
                />
                <input
                  value={editingItem.username || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, username: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="Username"
                />
                <input
                  value={editingItem.password || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, password: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="Password"
                  type="password"
                />
                <input
                  value={editingItem.url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="URL"
                />
                <textarea
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="Notes"
                  rows="2"
                />
                <div className="flex space-x-2">
                  <button onClick={saveEdit} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Save
                  </button>
                  <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="mt-1">Username: <span className="font-mono">{item.username}</span></p>
                <p className="mt-1">Password: <span className="font-mono">{item.password}</span></p>
                {item.url && <p className="mt-1">URL: <a href={item.url} className="text-blue-500 hover:underline">{item.url}</a></p>}
                {item.notes && <p className="mt-1">Notes: {item.notes}</p>}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => copyToClipboard(item.password)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Copy Password
                  </button>
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        // In Vault.js, update the loading if:
        if (loading || !password || password.length === 0) {
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-lg">Loading vault... (Password: {password ? 'Ready' : 'Missing'})</div> {/* Debug */}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Vault;