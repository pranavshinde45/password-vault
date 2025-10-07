import { useState, useEffect } from 'react';
import axios from 'axios';
import { encrypt, decrypt } from '../utils/Crypto';

export const useVault = (password) => {
  const [vault, setVault] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshVault = async () => {
    if (!password || password.length === 0) { // ✅ Stronger check
      console.log('Skipping refresh: Invalid password'); // Debug
      setLoading(false);
      setVault([]); // Empty fallback
      return;
    }
    console.log('Password ready—fetching vault (length:', password.length, ')'); // Debug
    try {
      const res = await axios.get('/api/vault');
      const decryptedVault = res.data.map((item) => ({
        ...item,
        username: decrypt(item.username || '', password),
        password: decrypt(item.password || '', password),
        notes: decrypt(item.notes || '', password)
      }));
      setVault(decryptedVault);
    } catch (err) {
      console.error('Vault fetch failed:', err);
      setVault([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshVault();
  }, [password]);

  const addItem = async (item) => {
    if (!password || password.length === 0) { // ✅ Stronger guard
      console.log('Add skipped: Invalid password (length:', password?.length, ')'); // Debug
      alert('Error: Cannot save without login. Please log in again.');
      return;
    }
    console.log('Encrypting item with password (length:', password.length, ')'); // Debug
    const encryptedItem = {
      ...item,
      username: encrypt(item.username || '', password),
      password: encrypt(item.password || '', password),
      notes: encrypt(item.notes || '', password)
    };
    try {
      await axios.post('/api/vault', encryptedItem);
      refreshVault();
    } catch (err) {
      console.error('Add failed:', err);
      alert('Save failed—check connection and try again.');
    }
  };

  const updateItem = async (id, updates) => {
    if (!password || password.length === 0) { // ✅ Stronger guard
      console.log('Update skipped: Invalid password'); // Debug
      alert('Error: Cannot update without login. Please log in again.');
      return;
    }
    const encryptedUpdates = {
      ...updates,
      ...(updates.username && { username: encrypt(updates.username, password) }),
      ...(updates.password && { password: encrypt(updates.password, password) }),
      ...(updates.notes && { notes: encrypt(updates.notes || '', password) })
    };
    try {
      await axios.put(`/api/vault/${id}`, { id, ...encryptedUpdates });
      refreshVault();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed—try again.');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/vault/${id}`);
      refreshVault();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed—try again.');
    }
  };

  const search = (query) => {
    setSearchQuery(query);
    const filtered = vault.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.url && item.url.toLowerCase().includes(query.toLowerCase()))
    );
    setVault(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    refreshVault();
  };

  return { vault, searchQuery, loading, addItem, updateItem, deleteItem, search, clearSearch };
};