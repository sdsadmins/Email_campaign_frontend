'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDataById } from '../../actions/action';
import EmailStatusComponent from './EmailStatusComponent';

export default function ContactDetailsComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getDataById(params.id);
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

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
                onClick={() => router.back()}
                className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">No Data Found</h1>
        <p className="mt-2 text-gray-600">The requested record could not be found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Details</h1>
            <p className="mt-2 text-gray-600">View detailed information for this contact.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            ← Back to List
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{data.full_name || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Primary Email</label>
              <p className="mt-1 text-sm text-gray-900">{data.email_first || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Secondary Email</label>
              <p className="mt-1 text-sm text-gray-900">{data.email_second || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{data.phone || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Company Phone</label>
              <p className="mt-1 text-sm text-gray-900">{data.company_phone || 'N/A'}</p>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Job Title</label>
              <p className="mt-1 text-sm text-gray-900">{data.job_title || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Company Name</label>
              <p className="mt-1 text-sm text-gray-900">{data.company_name || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Company Domain</label>
              <p className="mt-1 text-sm text-gray-900">{data.company_domain || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Company ID</label>
              <p className="mt-1 text-sm text-gray-900">{data.company_id || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">City</label>
              <p className="mt-1 text-sm text-gray-900">{data.city || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">LinkedIn URL</label>
              <p className="mt-1 text-sm text-gray-900">
                {data.url ? (
                  <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                    {data.url}
                  </a>
                ) : 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">LinkedIn ID</label>
              <p className="mt-1 text-sm text-gray-900">{data.linkedin_id || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">List Name</label>
              <p className="mt-1 text-sm text-gray-900">{data.list_name || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Created Date</label>
              <p className="mt-1 text-sm text-gray-900">
                {data.created_date ? new Date(data.created_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Email Status */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Email Status</h2>
          <div className="mt-4">
            <div className={`inline-flex items-center rounded-full border px-3 py-1 font-semibold text-sm ${
              data.mailsent 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                {data.mailsent ? (
                  <path d="M20 6 9 17l-5-5"></path>
                ) : (
                  <path d="M18 6L6 18M6 6l12 12"></path>
                )}
              </svg>
              {data.mailsent ? 'Email Sent' : 'Email Not Sent'}
            </div>
          </div>
        </div>

        {/* Template Information */}
        {data.sent_template_id && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Template Information</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Template Name</label>
                <p className="mt-1 text-sm text-gray-900">{data.sent_template_id.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Template Slug</label>
                <p className="mt-1 text-sm text-gray-900">{data.sent_template_id.slug || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Template Category</label>
                <p className="mt-1 text-sm text-gray-900">{data.sent_template_id.category || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Status Component */}
        <EmailStatusComponent userId={data._id} />
      </div>
    </div>
  );
}
