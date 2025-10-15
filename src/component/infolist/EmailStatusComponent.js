'use client';

import { useState, useEffect } from 'react';
import { getEmailStatus } from '../../actions/action';

export default function EmailStatusComponent({ userId }) {
  const [emailStatusData, setEmailStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmailStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getEmailStatus(userId);
        
        if (result.success) {
          setEmailStatusData(result);
        } else {
          setError(result.message || 'Failed to fetch email status');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching email status');
        console.error('Error fetching email status:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEmailStatus();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Email Campaign Status</h2>
        <div className="mt-4 flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Email Campaign Status</h2>
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Email Status</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!emailStatusData) {
    return null;
  }

  const { user, emailStatus } = emailStatusData;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Email Campaign Status</h2>
      

      {/* Email Status Summary */}
      {emailStatus ? (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">Total Templates</p>
                  <p className="text-2xl font-bold text-green-900">{emailStatus.totalTemplates}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Emails Sent</p>
                  <p className="text-2xl font-bold text-blue-900">{emailStatus.totalEmailsSent}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <div>
                  <p className="text-sm font-medium text-purple-800">Campaign Status</p>
                  <p className="text-lg font-bold text-purple-900">
                    {user.mailsent ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </div>



          {/* Templates Details */}
          {emailStatus.templates && emailStatus.templates.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Template Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent & Count</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count & Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emailStatus.templates.map((template, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <span className="font-medium">{template.templateId}</span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <span className="font-medium">{template.emailType}</span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              template.sendCount > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {template.sendCount > 0 ? 'Sent' : 'Not Sent'}
                            </span>
                            <span className="font-bold text-lg">{template.sendCount}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span className="font-bold text-lg">{template.sendCount}</span>
                            <span className="text-xs text-gray-500">
                              {template.lastSentDate ? new Date(template.lastSentDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">No Email Campaign Data</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This user has not been part of any email campaigns yet.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
