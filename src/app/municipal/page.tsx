'use client';

import { useState, useEffect } from 'react';
import { IssueDTO } from '@/types/issue';

export default function MunicipalDashboard() {
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<IssueDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Simulate user login - in a real app, this would come from authentication
  useEffect(() => {
    // Demo user data
    const demoUser = {
      userId: '507f1f77bcf86cd799439012',
      name: 'Jane Smith',
      email: 'jane.smith@municipal.gov',
      role: 'municipal'
    };
    setUser(demoUser);
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      const data = await response.json();
      setIssues(data.issues || []);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    setUpdating(issueId);
    
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the local state
        setIssues(issues.map(issue => 
          (issue._id?.toString?.() || issue._id) === issueId 
            ? { ...issue, status: newStatus as any, updatedAt: new Date() }
            : issue
        ));
      } else {
        alert('Failed to update issue status');
      }
    } catch (error) {
      console.error('Error updating issue:', error);
      alert('Error updating issue');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-in-progress';
      case 'solved': return 'status-solved';
      default: return 'status-pending';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'in_progress';
      case 'in_progress': return 'solved';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'Start Work';
      case 'in_progress': return 'Mark Solved';
      default: return null;
    }
  };

  const filteredIssues = statusFilter === 'all' 
    ? issues 
    : issues.filter(issue => issue.status === statusFilter);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Municipal Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user?.name}! Manage and track all reported civic issues.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-gray-900">{issues.length}</div>
          <div className="text-sm text-gray-600">Total Issues</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-warning-600">
            {issues.filter(i => i.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-600">
            {issues.filter(i => i.status === 'in_progress').length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-success-600">
            {issues.filter(i => i.status === 'solved').length}
          </div>
          <div className="text-sm text-gray-600">Solved</div>
        </div>
      </div>

      {/* Filter and Issues List */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            All Reported Issues ({filteredIssues.length})
          </h2>
          
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="solved">Solved</option>
            </select>
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No issues found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div key={(issue._id || Math.random().toString())} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{issue.title}</h3>
                    <p className="text-gray-600 mb-3">{issue.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>📍 {issue.location}</span>
                      <span>👤 {issue.createdBy?.name || 'Unknown User'}</span>
                      <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`status-badge ${getStatusColor(issue.status as string)}`}>
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                    
                    {getNextStatus(issue.status) && (
                      <button
                        onClick={() => updateIssueStatus((issue._id?.toString?.() || issue._id || ''), getNextStatus(issue.status as string)!)}
                        disabled={updating === (issue._id?.toString?.() || issue._id)}
                        className={`btn ${
                          issue.status === 'pending' ? 'btn-primary' : 'btn-success'
                        } text-sm`}
                      >
                        {updating === issue._id?.toString() ? 'Updating...' : getNextStatusLabel(issue.status)}
                      </button>
                    )}
                  </div>
                </div>
                
                {issue.photoUrl && (
                  <div className="mt-4">
                    <img
                      src={issue.photoUrl}
                      alt="Issue photo"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
