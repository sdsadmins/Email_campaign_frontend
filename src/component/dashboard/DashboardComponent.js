'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardStatistics, getAllTemplatesStatistics } from '../../actions/action';
import dynamic from 'next/dynamic';

const EmailCampaignChart = dynamic(() => import('../../components/charts/email-campaign-chart').then(mod => ({ default: mod.EmailCampaignChart })), {
  loading: () => <div className="h-[250px] bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false
});

export default function DashboardComponent() {
  const [dashboardData, setDashboardData] = useState(null);
  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if data is already cached
      const cachedData = sessionStorage.getItem('dashboardData');
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Use cached data if it's less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setDashboardData(data);
          setLoading(false);
          return;
        }
      }

      // Fetch dashboard statistics and templates data
      const [dashboardResult, templatesResult] = await Promise.all([
        getDashboardStatistics(),
        getAllTemplatesStatistics()
      ]);
      
      console.log('🔍 Dashboard API Response:', dashboardResult);
      console.log('📧 Templates API Response:', templatesResult);
      
      // Handle dashboard data
      if (dashboardResult.success && dashboardResult.data) {
        console.log('📊 Dashboard Data Structure:', dashboardResult.data);
        console.log('📧 Emails Per Day Data:', dashboardResult.data.emails_per_day);
        console.log('👥 Users Per Day Data:', dashboardResult.data.users_per_day);
        
        const newData = {
          data: dashboardResult.data,
          timestamp: Date.now()
        };

        // Cache the data
        sessionStorage.setItem('dashboardData', JSON.stringify(newData));
        setDashboardData(dashboardResult.data);
      } else if (dashboardResult.data) {
        // Handle case where API returns data directly without success wrapper
        console.log('📊 Dashboard Data (Direct):', dashboardResult.data);
        console.log('📧 Emails Per Day Data:', dashboardResult.data.emails_per_day);
        console.log('👥 Users Per Day Data:', dashboardResult.data.users_per_day);
        
        const newData = {
          data: dashboardResult.data,
          timestamp: Date.now()
        };

        // Cache the data
        sessionStorage.setItem('dashboardData', JSON.stringify(newData));
        setDashboardData(dashboardResult.data);
      } else {
        console.error('❌ Invalid dashboard API response structure:', dashboardResult);
        throw new Error('Invalid response from dashboard API');
      }
      
      // Handle templates data
      if (templatesResult.templates && Array.isArray(templatesResult.templates)) {
        setTemplatesData(templatesResult.templates);
      } else if (templatesResult.message && templatesResult.templates) {
        setTemplatesData(templatesResult.templates);
      } else if (templatesResult.data && templatesResult.data.templates) {
        setTemplatesData(templatesResult.data.templates);
      } else {
        setTemplatesData([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchDashboardData}
                className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your email campaign performance and statistics.</p>
      </div>

      {/* Overall Statistics Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Daily Users */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Daily Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.users_per_day?.slice(-1)[0]?.count || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.users_per_day?.reduce((sum, day) => sum + day.count, 0) || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Total Mail Sent */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Mail Sent</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData.total_mail_sent?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          {/* Active Templates */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Templates</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData.active_templates || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Chart */}
      <div className="mb-6">
        <EmailCampaignChart 
          dashboardData={dashboardData}
        />
      </div>

      {/* Individual Templates Performance */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Individual Templates Performance</h3>
          {templatesData && (
            <div className="text-sm text-gray-500">
              <span className="font-medium text-blue-600">{templatesData.length}</span> templates
            </div>
          )}
        </div>
        {templatesData && templatesData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templatesData.map((template, index) => (
              <div key={template._id} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-sm font-semibold text-purple-700">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 truncate">{template.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {template.category}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          template.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {template.totalSent || 0} emails
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No template data available</p>
        )}
      </div>



      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/email-campaign/info-list" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Manage Contacts</p>
                <p className="text-xs text-gray-500">View and manage your contact lists</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/email-campaign/email-templates" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Email Templates</p>
                <p className="text-xs text-gray-500">Create and manage email templates</p>
              </div>
            </div>
          </Link>

          <Link 
            href="/email-campaign/dashboard" 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500">View detailed analytics and reports</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
