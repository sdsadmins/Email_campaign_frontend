'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEmailTemplateById } from '../../actions/action';

export default function EmailTemplatePreviewComponent() {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getEmailTemplateById(params.id);
        
        if (result.template) {
          console.log('Template data:', result.template);
          setTemplate(result.template);
        } else {
          setError(result.message || 'Failed to fetch template');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching template');
        console.error('Error fetching template:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTemplate();
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
            <h3 className="text-sm font-medium text-red-800">Error Loading Template</h3>
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

  if (!template) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Template Not Found</h1>
        <p className="mt-2 text-gray-600">The requested template could not be found.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Template Preview</h1>
            <p className="mt-2 text-gray-600">Preview of your email template.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            ← Back to Templates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-sm text-gray-900">{template.name || template.title || 'Untitled Template'}</p>
              </div>

              {template.slug && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Slug</label>
                  <p className="mt-1 text-sm text-gray-900">{template.slug}</p>
                </div>
              )}

              {template.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{template.category}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  template.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {template.tags && template.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {template.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Subject</label>
                  <p className="mt-1 text-sm text-gray-900">{template.subject}</p>
                </div>
              )}

              {template.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{template.description}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="text-xs text-gray-500">
                  <p>Created: {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}</p>
                  {template.updatedAt && (
                    <p>Updated: {new Date(template.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Preview</h3>
            </div>
            
            <div className="p-6">
              {template.subject && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Subject Line</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-sm text-gray-900">{template.subject}</p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Content</label>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  {template.htmlContent || template.html_content || template.content || template.body ? (
                    <div 
                      className="p-4 bg-white"
                      dangerouslySetInnerHTML={{ 
                        __html: template.htmlContent || template.html_content || template.content || template.body 
                      }}
                    />
                  ) : template.textContent || template.text_content || template.text ? (
                    <div className="p-4 bg-white">
                      <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                        {template.textContent || template.text_content || template.text}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No content available for this template</p>
                      <div className="mt-4 text-xs text-gray-400">
                        <p>Available fields: {Object.keys(template).join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
