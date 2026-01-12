'use client';

import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Users } from 'lucide-react';

export default function ShareDocumentModal({ document, isOpen, onClose, onShare }) {
    const [orgUsers, setOrgUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentShares, setCurrentShares] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);

    useEffect(() => {
        if (isOpen && document) {
            fetchOrgUsers();
            fetchCurrentShares();
        }
    }, [isOpen, document]);

    const fetchOrgUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrgUsers(data.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const fetchCurrentShares = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/documents/share?documentId=${document.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentShares(data.shares || []);
            }
        } catch (error) {
            console.error('Failed to fetch shares:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (selectedUsers.length === 0) {
            alert('Please select at least one user');
            return;
        }

        try {
            setSharing(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/documents/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    documentId: document.id,
                    user Ids: selectedUsers
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || 'Document shared successfully');
                setSelectedUsers([]);
                fetchCurrentShares();
                if (onShare) onShare();
            } else {
                alert(data.error || 'Failed to share document');
            }
        } catch (error) {
            alert('Failed to share document');
        } finally {
            setSharing(false);
        }
    };

    const handleRevoke = async (userId) => {
        if (!confirm('Are you sure you want to revoke access?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/documents/share?documentId=${document.id}&userId=${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                fetchCurrentShares();
                if (onShare) onShare();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to revoke share');
            }
        } catch (error) {
            alert('Failed to revoke share');
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const filteredUsers = orgUsers.filter(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''} ${user.email}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    // Filter out users who already have access
    const sharedUserIds = currentShares.map(share => share.shared_with);
    const availableUsers = filteredUsers.filter(user => !sharedUserIds.includes(user.id));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            Share Document
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{document?.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Share with users */}
                    <div className="mb-6">
                        <h3 className="text-white font-medium mb-3">Share with:</h3>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search users..."
                                className="w-full pl-10 pr-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* User list */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {availableUsers.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">
                                    {searchTerm ? 'No users found' : 'All users already have access'}
                                </p>
                            ) : (
                                availableUsers.map(user => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleUserSelection(user.id)}
                                            className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-medium">
                                                {user.first_name || user.last_name
                                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                                    : 'No name'}
                                            </p>
                                            <p className="text-gray-400 text-xs">{user.email}</p>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Current shares */}
                    {currentShares.length > 0 && (
                        <div className="border-t border-gray-800 pt-6">
                            <h3 className="text-white font-medium mb-3">Currently shared with:</h3>
                            <div className="space-y-2">
                                {currentShares.map(share => (
                                    <div
                                        key={share.id}
                                        className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                                    >
                                        <div>
                                            <p className="text-white text-sm font-medium">
                                                {share.first_name || share.last_name
                                                    ? `${share.first_name || ''} ${share.last_name || ''}`.trim()
                                                    : 'No name'}
                                            </p>
                                            <p className="text-gray-400 text-xs">{share.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRevoke(share.shared_with)}
                                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-800 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={selectedUsers.length === 0 || sharing}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <UserPlus className="h-4 w-4" />
                        {sharing ? 'Sharing...' : `Share with ${selectedUsers.length || ''} user${selectedUsers.length !== 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
