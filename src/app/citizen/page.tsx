'use client';

import { useState, useEffect } from 'react';
import { Issue } from '@/models/Issue';

export default function CitizenDashboard() {
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Simulate user login - in a real app, this would come from authentication
  useEffect(() => {
    // Demo user data
    const demoUser = {
      userId: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'citizen'
    };
    setUser(demoUser);
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const response = await fetch(`/api/issues?createdBy=${user?.userId}`);
      const data = await response.json();
      setIssues(data.issues || []);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIssue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const issueData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      createdBy: user?.userId,
      photoUrl: 'https://via.placeholder.com/400x300?text=Issue+Photo' // Placeholder
    };

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        setShowForm(false);
        loadIssues(); // Reload issues
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        alert('Failed to submit issue');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Error submitting issue');
    } finally {
      setSubmitting(false);
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
          Citizen Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user?.name}! Report civic issues and track their progress.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Issue Submission Form */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Report New Issue
            </h2>
            
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary w-full"
              >
                + Submit New Issue
              </button>
            ) : (
              <form onSubmit={handleSubmitIssue} className="space-y-4">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="form-input"
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="form-input"
                    placeholder="Detailed description of the issue"
                  />
                </div>
                
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="form-input"
                    placeholder="Street address or landmark"
                  />
                </div>
                
                <div>
                  <label className="form-label">Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">
                      Photo upload placeholder
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      (In a real app, this would handle file uploads)
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary flex-1"
                  >
                    {submitting ? 'Submitting...' : 'Submit Issue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Issues List */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Reported Issues ({issues.length})
            </h2>
            
            {issues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No issues reported yet.</p>
                <p className="text-sm mt-1">Click "Submit New Issue" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue._id?.toString()} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                      <span className={`status-badge ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>📍 {issue.location}</span>
                      <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {issue.photoUrl && (
                      <div className="mt-3">
                        <img
                          src={issue.photoUrl}
                          alt="Issue photo"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
