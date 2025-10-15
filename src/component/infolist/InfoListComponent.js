'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllData } from '../../actions/action';
import EmailModal from './EmailModal';

export default function InfoListComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailStatusFilter, setEmailStatusFilter] = useState('all'); // 'all', 'sent', 'not_sent'
  const [fromDate, setFromDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  
  // Pagination states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10
  });

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = {
        ...filters,
        search: searchTerm || undefined,
        has_emails_sent: emailStatusFilter === 'all' ? undefined : emailStatusFilter === 'sent',
        from_date: fromDate || undefined
      };
      
      
      const result = await getAllData(queryParams);
      
      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, emailStatusFilter, fromDate]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle pagination changes
  const handlePaginationChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Handle email button click
  const handleEmailClick = (user) => {
    setSelectedUser(user);
    setShowEmailModal(true);
  };

  // Handle close email modal
  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setSelectedUser(null);
    setSelectedUsers([]);
  };

  // Handle individual user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedUsers([]);
    setShowEmailModal(true);
  };

  // Handle multiple user selection
  const handleUserCheckboxChange = (user, isChecked) => {
    if (isChecked) {
      setSelectedUsers(prev => [...prev, user]);
    } else {
      setSelectedUsers(prev => prev.filter(u => u._id !== user._id));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      setSelectedUsers([...data]);
      setSelectAll(true);
    }
  };

  // Handle bulk email
  const handleBulkEmail = () => {
    if (selectedUsers.length > 0) {
      setSelectedUser(null);
      setShowEmailModal(true);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle email status filter
  const handleEmailStatusFilter = (status) => {
    setEmailStatusFilter(status);
  };

  // Handle from date filter
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
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
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchData}
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
    <div className="w-full">
      {/* Header with Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Info List</h1>
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={handleBulkEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Bulk Email
              </button>
            </div>
          )}
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Search Bar - Larger size */}
            <div className="xl:w-[500px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Contacts
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* From Date Filter */}
            <div className="xl:w-56">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                />
                {fromDate && (
                  <button
                    onClick={() => setFromDate('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  >
                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter Dropdown */}
            <div className="xl:w-56">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                </div>
                <select
                  value={emailStatusFilter}
                  onChange={(e) => handleEmailStatusFilter(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 appearance-none bg-white"
                >
                  <option value="all">All Contacts</option>
                  <option value="sent">Email Sent</option>
                  <option value="not_sent">Email Not Sent</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="xl:w-auto flex items-end">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex items-center px-4 py-3 rounded-lg border transition-all duration-200 ${
                  refreshing
                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
              >
                <svg
                  className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(searchTerm || emailStatusFilter !== 'all' || fromDate) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: &quot;{searchTerm}&quot;
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {fromDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    From: {fromDate}
                    <button
                      onClick={() => setFromDate('')}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {emailStatusFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: {emailStatusFilter === 'sent' ? 'Email Sent' : 'Email Not Sent'}
                    <button
                      onClick={() => handleEmailStatusFilter('all')}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFromDate('');
                    handleEmailStatusFilter('all');
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 border border-gray-300"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
        {refreshing ? (
          // Skeleton Loading
          <div className="p-4">
            <div className="animate-pulse">
              {/* Table Header Skeleton */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-4 bg-gray-200 rounded w-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              
              {/* Table Rows Skeleton */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 mb-3 py-3">
                  <div className="h-4 bg-gray-200 rounded w-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r whitespace-nowrap w-12">
                <input 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r whitespace-nowrap min-w-[150px]">
                Name
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r whitespace-nowrap min-w-[180px]">
                Email 1
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r whitespace-nowrap min-w-[180px]">
                Email 2
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r min-w-[150px]">
                Job Title
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r whitespace-nowrap min-w-[150px]">
                Company
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r min-w-[100px]">
                City
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r whitespace-nowrap min-w-[100px]">
                Status
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 border-r whitespace-nowrap min-w-[80px]">
                Actions
              </th>
              <th className="h-12 px-2 text-left align-middle font-medium text-gray-500 whitespace-nowrap min-w-[100px]">
                View Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id || index} className="border-b hover:bg-gray-50 cursor-pointer">
                <td className="p-2 align-middle border-r whitespace-nowrap w-12">
                  <input 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    type="checkbox" 
                    checked={selectedUsers.some(user => user._id === item._id)}
                    onChange={(e) => handleUserCheckboxChange(item, e.target.checked)}
                  />
                </td>
                <td className="p-2 align-middle border-r whitespace-nowrap min-w-[150px]">
                  <div>
                    <span className="font-medium text-sm">
                      {item.full_name || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="p-2 align-middle border-r whitespace-nowrap min-w-[180px]">
                  <div className="text-sm">
                    {item.email_first || 'N/A'}
                  </div>
                </td>
                <td className="p-2 align-middle border-r whitespace-nowrap min-w-[180px]">
                  <div className="text-sm">
                    {item.email_second || 'N/A'}
                  </div>
                </td>
                <td className="p-2 align-middle border-r min-w-[150px]">
                  <div className="text-sm leading-tight">
                    {item.job_title || 'N/A'}
                  </div>
                </td>
                <td className="p-2 align-middle border-r whitespace-nowrap min-w-[150px]">
                  <div className="text-sm">
                    {item.company_name || 'N/A'}
                  </div>
                </td>
                <td className="p-2 align-middle border-r min-w-[100px]">
                  <div className="text-sm leading-tight break-words">
                    {item.city || 'N/A'}
                  </div>
                </td>
                <td className="p-2 align-middle border-r whitespace-nowrap min-w-[100px]">
                  <div>
                    <div className={`inline-flex items-center rounded-full border-2 px-3 py-1 font-bold text-xs shadow-sm ${
                      item.mailsent 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-600 shadow-green-200' 
                        : 'bg-gradient-to-r from-red-400 to-red-500 text-white border-red-600 shadow-red-200'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 h-3.5 w-3.5">
                        {item.mailsent ? (
                          <path d="M20 6 9 17l-5-5"></path>
                        ) : (
                          <path d="M18 6L6 18M6 6l12 12"></path>
                        )}
                      </svg>
                      {item.mailsent ? 'Email Sent' : 'Email Not Sent'}
                    </div>
                  </div>
                </td>
                <td className="p-2 align-middle border-r whitespace-nowrap min-w-[80px]">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => handleUserSelect(item)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105" 
                      title="Send Email"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="p-2 align-middle whitespace-nowrap min-w-[100px]">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => router.push(`/email-campaign/info-list/${item._id}`)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105" 
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-700">Rows per page</p>
          <select
            value={filters.limit}
            onChange={(e) => handlePaginationChange('limit', parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.current_page <= 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to first page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m11 17-5-5 5-5"></path>
                <path d="m18 17-5-5 5-5"></path>
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.total_pages}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(pagination.total_pages)}
              disabled={pagination.current_page >= pagination.total_pages}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to last page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 17 5-5-5-5"></path>
                <path d="m13 17 5-5-5-5"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Email Modal */}
      <EmailModal 
        isOpen={showEmailModal}
        onClose={handleCloseEmailModal}
        userData={selectedUser}
        selectedUsers={selectedUsers}
      />
    </div>
  );
}
