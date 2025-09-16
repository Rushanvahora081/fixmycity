'use client';

import { useState, useEffect } from 'react';
import { IssueDTO } from '@/types/issue';
import { UserDTO } from '@/types/user';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<IssueDTO[]>([]);
  const [municipalOfficers, setMunicipalOfficers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateOfficer, setShowCreateOfficer] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Simulate user login - in a real app, this would come from authentication
  useEffect(() => {
    // Demo user data
    const demoUser = {
      userId: '507f1f77bcf86cd799439013',
      name: 'Admin User',
      email: 'admin@fixmycity.gov',
      role: 'admin'
    };
    setUser(demoUser);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [issuesResponse, officersResponse] = await Promise.all([
        fetch('/api/issues'),
        fetch('/api/users?role=municipal')
      ]);
      
      const issuesData = await issuesResponse.json();
      const officersData = await officersResponse.json();
      
      setIssues(issuesData.issues || []);
      setMunicipalOfficers(officersData.users || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOfficer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    const formData = new FormData(e.currentTarget);
    const officerData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: 'municipal'
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(officerData),
      });

      if (response.ok) {
        setShowCreateOfficer(false);
        loadData(); // Reload data
        (e.target as HTMLFormElement).reset();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create officer');
      }
    } catch (error) {
      console.error('Error creating officer:', error);
      alert('Error creating officer');
    } finally {
      setCreating(false);
    }
  };

  const deleteOfficer = async (officerId: string) => {
    if (!confirm('Are you sure you want to delete this officer?')) return;
    
    setDeleting(officerId);
    
    try {
      const response = await fetch(`/api/users/${officerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData(); // Reload data
      } else {
        alert('Failed to delete officer');
      }
    } catch (error) {
      console.error('Error deleting officer:', error);
      alert('Error deleting officer');
    } finally {
      setDeleting(null);
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
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user?.name}! Manage municipal officers and view city-wide analytics.
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
          <div className="text-sm text-gray-600">Pending Issues</div>
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
          <div className="text-sm text-gray-600">Solved Issues</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Municipal Officers Management */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Municipal Officers ({municipalOfficers.length})
            </h2>
            <button
              onClick={() => setShowCreateOfficer(true)}
              className="btn btn-primary"
            >
              + Add Officer
            </button>
          </div>

          {showCreateOfficer && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Create New Officer</h3>
              <form onSubmit={createOfficer} className="space-y-4">
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-input"
                    placeholder="Officer's full name"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-input"
                    placeholder="officer@municipal.gov"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn btn-primary"
                  >
                    {creating ? 'Creating...' : 'Create Officer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateOfficer(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {municipalOfficers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No municipal officers found.</p>
              <p className="text-sm mt-1">Click "Add Officer" to create one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {municipalOfficers.map((officer) => (
                <div key={officer._id?.toString()} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{officer.name}</div>
                    <div className="text-sm text-gray-500">{officer.email}</div>
                    <div className="text-xs text-gray-400">
                      Created: {new Date(officer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteOfficer(officer._id?.toString() || '')}
                    disabled={deleting === officer._id?.toString()}
                    className="btn btn-danger text-sm"
                  >
                    {deleting === officer._id?.toString() ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Issues */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Issues
          </h2>

          {issues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No issues reported yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.slice(0, 5).map((issue) => (
                <div key={issue._id?.toString()} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{issue.title}</h3>
                    <span className={`status-badge ${getStatusColor(issue.status as string)} text-xs`}>
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">{issue.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>📍 {issue.location}</span>
                    <span>👤 {issue.createdBy?.name || 'Unknown'}</span>
                    <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              
              {issues.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing 5 of {issues.length} issues
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* All Issues Table */}
      <div className="card p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          All Issues Overview
        </h2>

        {issues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No issues found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {issues.map((issue) => (
                  <tr key={(issue._id || Math.random().toString())}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{issue.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.createdBy?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge ${getStatusColor(issue.status as string)}`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
