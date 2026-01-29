'use client';

import { useState, useEffect } from 'react';
import { Key, Copy, Trash2, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';

export default function ApiKeysTab() {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKey, setNewKey] = useState({ name: '', description: '' });
    const [createdKey, setCreatedKey] = useState(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/api-keys', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setApiKeys(data.apiKeys || []);
            }
        } catch (error) {
            console.error('Failed to fetch API keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async (e) => {
        e.preventDefault();
        if (!newKey.name.trim()) {
            alert('Please enter a name for your API key');
            return;
        }

        setCreating(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/api-keys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newKey),
            });

            if (res.ok) {
                const data = await res.json();
                setCreatedKey(data.apiKey);
                setNewKey({ name: '', description: '' });
                fetchApiKeys();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create API key');
            }
        } catch (error) {
            alert('Failed to create API key');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteKey = async (keyId, keyName) => {
        if (!confirm(`Are you sure you want to delete "${keyName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`/api/api-keys?keyId=${keyId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchApiKeys();
                alert('API key deleted successfully');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete API key');
            }
        } catch (error) {
            alert('Failed to delete API key');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const closeCreatedKeyModal = () => {
        setCreatedKey(null);
        setShowCreateModal(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">API Keys</h2>
                    <p className="text-gray-400 text-sm">Manage API keys for programmatic access to your Operon data</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Create API Key
                </button>
            </div>

            {/* API Keys List */}
            {loading ? (
                <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-gray-800 text-center">
                    <p className="text-gray-400">Loading...</p>
                </div>
            ) : apiKeys.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-gray-800 text-center">
                    <Key className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No API keys yet</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Your First API Key
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {apiKeys.map((key) => (
                        <div
                            key={key.id}
                            className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Key className="h-5 w-5 text-blue-500" />
                                        <h3 className="text-white font-semibold">{key.name}</h3>
                                        {key.is_active ? (
                                            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full">
                                                Revoked
                                            </span>
                                        )}
                                    </div>
                                    {key.description && (
                                        <p className="text-gray-400 text-sm mb-2">{key.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>Key: {key.key_prefix}</span>
                                        <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                                        {key.last_used_at && (
                                            <span>Last used: {new Date(key.last_used_at).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteKey(key.id, key.name)}
                                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create API Key Modal */}
            {showCreateModal && !createdKey && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 max-w-lg w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Create API Key</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateKey} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={newKey.name}
                                    onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="e.g., Production API, Test Integration"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Description (optional)</label>
                                <textarea
                                    value={newKey.description}
                                    onChange={(e) => setNewKey({ ...newKey, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="What will this key be used for?"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Create API Key'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Created Key Modal */}
            {createdKey && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 max-w-2xl w-full mx-4">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                            <h2 className="text-2xl font-bold text-white">API Key Created!</h2>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                <div>
                                    <p className="text-yellow-500 font-semibold mb-1">Save this key now!</p>
                                    <p className="text-yellow-500/80 text-sm">
                                        For security reasons, you won't be able to see this key again. Make sure to copy it and store it securely.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0d0d0d] rounded-xl p-4 mb-6">
                            <label className="block text-gray-400 text-sm mb-2">Your API Key</label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-white font-mono text-sm break-all">{createdKey.key}</code>
                                <button
                                    onClick={() => copyToClipboard(createdKey.key)}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={closeCreatedKeyModal}
                            className="w-full px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
