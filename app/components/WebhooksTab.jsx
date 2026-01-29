'use client';

import { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2, TestTube, Eye, X, CheckCircle2, Copy, AlertCircle } from 'lucide-react';

export default function WebhooksTab() {
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWebhook, setNewWebhook] = useState({
        url: '',
        events: [],
        description: ''
    });
    const [createdWebhook, setCreatedWebhook] = useState(null);
    const [creating, setCreating] = useState(false);
    const [testingId, setTestingId] = useState(null);
    const [viewingLogs, setViewingLogs] = useState(null);
    const [deliveries, setDeliveries] = useState([]);

    const availableEvents = [
        { value: 'automation.created', label: 'Automation Created' },
        { value: 'automation.completed', label: 'Automation Completed' },
        { value: 'automation.failed', label: 'Automation Failed' },
        { value: 'email.received', label: 'Email Received' },
        { value: 'email.sent', label: 'Email Sent' },
        { value: 'task.created', label: 'Task Created' },
        { value: 'task.completed', label: 'Task Completed' },
        { value: 'task.updated', label: 'Task Updated' },
        { value: 'integration.connected', label: 'Integration Connected' },
        { value: 'integration.disconnected', label: 'Integration Disconnected' }
    ];

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const fetchWebhooks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/v1/webhooks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setWebhooks(data.webhooks || []);
            }
        } catch (error) {
            console.error('Failed to fetch webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWebhook = async (e) => {
        e.preventDefault();
        if (!newWebhook.url || newWebhook.events.length === 0) {
            alert('Please enter a URL and select at least one event');
            return;
        }

        setCreating(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('/api/v1/webhooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newWebhook),
            });

            if (res.ok) {
                const data = await res.json();
                setCreatedWebhook(data.webhook);
                setNewWebhook({ url: '', events: [], description: '' });
                fetchWebhooks();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to create webhook');
            }
        } catch (error) {
            alert('Failed to create webhook');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteWebhook = async (webhookId, url) => {
        if (!confirm(`Are you sure you want to delete webhook for "${url}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`/api/v1/webhooks/${webhookId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchWebhooks();
                alert('Webhook deleted successfully');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete webhook');
            }
        } catch (error) {
            alert('Failed to delete webhook');
        }
    };

    const handleTestWebhook = async (webhookId) => {
        setTestingId(webhookId);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`/api/v1/webhooks/${webhookId}/test`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                alert(`Test webhook sent successfully! Status: ${data.statusCode}`);
            } else {
                alert(data.message || 'Test webhook failed');
            }
        } catch (error) {
            alert('Failed to send test webhook');
        } finally {
            setTestingId(null);
        }
    };

    const viewDeliveryLogs = async (webhookId) => {
        setViewingLogs(webhookId);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`/api/v1/webhooks/${webhookId}/deliveries`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setDeliveries(data.deliveries || []);
            }
        } catch (error) {
            console.error('Failed to fetch delivery logs:', error);
        }
    };

    const toggleEvent = (event) => {
        setNewWebhook(prev => {
            const events = prev.events.includes(event)
                ? prev.events.filter(e => e !== event)
                : [...prev.events, event];
            return { ...prev, events };
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">Webhooks</h2>
                    <p className="text-gray-400 text-sm">Receive real-time notifications for events in your organization</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Create Webhook
                </button>
            </div>

            {/* Webhooks List */}
            {loading ? (
                <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-gray-800 text-center">
                    <p className="text-gray-400">Loading...</p>
                </div>
            ) : webhooks.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-gray-800 text-center">
                    <Webhook className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No webhooks configured</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Your First Webhook
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {webhooks.map((webhook) => (
                        <div
                            key={webhook.id}
                            className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Webhook className="h-5 w-5 text-blue-500" />
                                        <code className="text-white font-mono text-sm">{webhook.url}</code>
                                        {webhook.is_active ? (
                                            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    {webhook.description && (
                                        <p className="text-gray-400 text-sm mb-2">{webhook.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {webhook.events.map(event => (
                                            <span
                                                key={event}
                                                className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full"
                                            >
                                                {event}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-sm text-gray-500">
                                        {webhook.last_triggered_at && (
                                            <span>Last triggered: {new Date(webhook.last_triggered_at).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleTestWebhook(webhook.id)}
                                        disabled={testingId === webhook.id}
                                        className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <TestTube className="h-4 w-4" />
                                        {testingId === webhook.id ? 'Testing...' : 'Test'}
                                    </button>
                                    <button
                                        onClick={() => viewDeliveryLogs(webhook.id)}
                                        className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Logs
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWebhook(webhook.id, webhook.url)}
                                        className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Webhook Modal */}
            {showCreateModal && !createdWebhook && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 max-w-2xl w-full mx-4 my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Create Webhook</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateWebhook} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Webhook URL *</label>
                                <input
                                    type="url"
                                    value={newWebhook.url}
                                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="https://your-server.com/webhook"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Description (optional)</label>
                                <input
                                    type="text"
                                    value={newWebhook.description}
                                    onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="What is this webhook for?"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-3">Events to Subscribe * (select at least one)</label>
                                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                    {availableEvents.map(event => (
                                        <label
                                            key={event.value}
                                            className="flex items-center gap-2 p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg hover:border-blue-500 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={newWebhook.events.includes(event.value)}
                                                onChange={() => toggleEvent(event.value)}
                                                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-white text-sm">{event.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    {creating ? 'Creating...' : 'Create Webhook'}
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

            {/* Created Webhook Modal */}
            {createdWebhook && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 max-w-2xl w-full mx-4">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                            <h2 className="text-2xl font-bold text-white">Webhook Created!</h2>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                <div>
                                    <p className="text-yellow-500 font-semibold mb-1">Save your webhook secret!</p>
                                    <p className="text-yellow-500/80 text-sm">
                                        Use this secret to verify webhook signatures. You won't be able to see it again.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0d0d0d] rounded-xl p-4 mb-6">
                            <label className="block text-gray-400 text-sm mb-2">Webhook Secret</label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-white font-mono text-sm break-all">{createdWebhook.secret}</code>
                                <button
                                    onClick={() => copyToClipboard(createdWebhook.secret)}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => { setCreatedWebhook(null); setShowCreateModal(false); }}
                            className="w-full px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Delivery Logs Modal */}
            {viewingLogs && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Delivery Logs</h2>
                            <button
                                onClick={() => setViewingLogs(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {deliveries.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No deliveries yet</p>
                        ) : (
                            <div className="space-y-3">
                                {deliveries.map(delivery => (
                                    <div
                                        key={delivery.id}
                                        className="bg-[#0d0d0d] rounded-lg p-4 border border-gray-700"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <code className="text-blue-400 text-sm">{delivery.event_type}</code>
                                            <span className={`px-2 py-1 text-xs rounded-full ${delivery.status === 'success'
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {delivery.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400 space-y-1">
                                            {delivery.response_code && (
                                                <p>Response Code: {delivery.response_code}</p>
                                            )}
                                            {delivery.error_message && (
                                                <p className="text-red-400">Error: {delivery.error_message}</p>
                                            )}
                                            <p>Attempts: {delivery.attempts}</p>
                                            <p>Created: {new Date(delivery.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
