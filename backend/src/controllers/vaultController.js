const User = require('../models/user');
const { validateEncrypted } = require('../utils/crypto');

exports.getVault = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('vault');
    res.json(user.vault);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vault' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { title, username, password, url, notes } = req.body; // Encrypted client-side
    if (!validateEncrypted(username || '') || !validateEncrypted(password || '')) {
      return res.status(400).json({ error: 'Encrypted fields required' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { vault: req.body } },
      { new: true }
    ).select('vault');
    res.json(user.vault);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id, ...updates } = req.body;
    const user = await User.findById(req.user.userId);
    const itemIndex = user.vault.findIndex((item) => item._id.toString() === id);
    if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });

    // Validate updated encrypted fields
    if (updates.username && !validateEncrypted(updates.username)) {
      return res.status(400).json({ error: 'Encrypted fields required' });
    }
    if (updates.password && !validateEncrypted(updates.password)) {
      return res.status(400).json({ error: 'Encrypted fields required' });
    }
    if (updates.notes && !validateEncrypted(updates.notes)) {
      return res.status(400).json({ error: 'Encrypted fields required' });
    }

    user.vault[itemIndex] = { ...user.vault[itemIndex], ...updates };
    await user.save();
    res.json(user.vault);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { vault: { _id: id } } },
      { new: true }
    ).select('vault');
    res.json(user.vault);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

exports.searchVault = async (req, res) => {
  try {
    const { query } = req.query;
    const user = await User.findById(req.user.userId).select('vault');
    const filtered = user.vault.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.url && item.url.toLowerCase().includes(query.toLowerCase()))
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};