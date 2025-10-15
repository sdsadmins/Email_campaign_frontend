'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEmailTemplateById, updateEmailTemplate } from '../../actions/action';

export default function EmailTemplateEditComponent() {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    category: '',
    slug: '',
    isActive: true
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewMode, setViewMode] = useState('html'); // 'html' or 'text'
  
  // Static list of available placeholders from InfoList schema
  const staticPlaceholders = [
    'email_first',
    'email_second', 
    'phone',
    'company_phone',
    'url',
    'job_title',
    'company_name',
    'company_domain',
    'company_id',
    'city',
    'linkedin_id',
    'created_date',
    'list_name',
    'full_name',
    'mailsent',
    'sent_template_id',
    'email_status_id'
  ];
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getEmailTemplateById(params.id);
        
        if (result.template) {
          setTemplate(result.template);
          setFormData({
            name: result.template.name || result.template.title || '',
            subject: result.template.subject || '',
            content: result.template.content || result.template.htmlContent || result.template.htmlContent || result.template.body || '',
            category: result.template.category || '',
            slug: result.template.slug || '',
            isActive: result.template.isActive !== undefined ? result.template.isActive : true
          });
          // Template loaded successfully
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Always save in HTML mode - convert text to HTML if needed
      let contentToSave = formData.content;
      if (viewMode === 'text') {
        contentToSave = textToHtml(formData.content);
      }
      
      const templateData = {
        ...formData,
        content: contentToSave
      };
      
      const result = await updateEmailTemplate(params.id, templateData);
      
      if (result.template) {
        setTemplate(result.template);
        setShowSuccessModal(true);
      } else {
        setError(result.message || 'Failed to update template');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating template');
      console.error('Error updating template:', err);
    } finally {
      setSaving(false);
    }
  };

  const insertPlaceholder = (placeholder) => {
    const currentContent = formData.content;
    const newContent = currentContent + `{{${placeholder}}}`;
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  // Convert HTML to text
  const htmlToText = (html) => {
    if (!html) return '';
    
    // First, convert <br> tags to line breaks
    let text = html.replace(/<br\s*\/?>/gi, '\n');
    
    // Convert paragraph tags to double line breaks
    text = text.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
    text = text.replace(/<p[^>]*>/gi, '');
    text = text.replace(/<\/p>/gi, '\n\n');
    
    // Remove other HTML tags but preserve content
    text = text.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    text = text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ');
    
    // Clean up extra whitespace but preserve line breaks
    text = text.replace(/[ \t]+/g, ' '); // Replace multiple spaces/tabs with single space
    text = text.replace(/\n{3,}/g, '\n\n'); // Replace 3+ line breaks with 2
    text = text.trim();
    
    return text;
  };

  // Convert text to HTML
  const textToHtml = (text) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\s+/g, ' '); // Normalize spaces
  };

  // Toggle between HTML and text view
  const toggleViewMode = () => {
    if (viewMode === 'html') {
      // Convert HTML to text
      const textContent = htmlToText(formData.content);
      setFormData(prev => ({
        ...prev,
        content: textContent
      }));
      setViewMode('text');
    } else {
      // Convert text to HTML
      const htmlContent = textToHtml(formData.content);
      setFormData(prev => ({
        ...prev,
        content: htmlContent
      }));
      setViewMode('html');
    }
  };

  // Function to extract placeholders from content
  const extractPlaceholdersFromContent = (content) => {
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const matches = content.match(placeholderRegex);
    if (matches) {
      return matches.map(match => match.replace(/\{\{|\}\}/g, ''));
    }
    return [];
  };

  // Function to remove placeholder from content
  const removePlaceholderFromContent = (placeholder) => {
    const placeholderToRemove = `{{${placeholder}}}`;
    const newContent = formData.content.replace(new RegExp(placeholderToRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  // Get current placeholders from content
  const currentPlaceholders = extractPlaceholdersFromContent(formData.content);

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
            <h1 className="text-3xl font-bold text-gray-900">Edit Template</h1>
            <p className="mt-2 text-gray-600">Update your email template content and settings.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            ← Back to Templates
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template slug"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email subject"
                />
              </div>

              {/* Template Tags Display */}
              {template?.tags && template.tags.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Template Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md border border-green-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Placeholders from Content */}
              {currentPlaceholders.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detected Placeholders (will be added to tags when saved)</label>
                  <div className="flex flex-wrap gap-2">
                    {currentPlaceholders.map((placeholder, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md border border-blue-200">
                        {`{{${placeholder}}}`}
                        <button
                          type="button"
                          onClick={() => removePlaceholderFromContent(placeholder)}
                          className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="Remove placeholder"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}


              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active Template
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Content</h2>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Content ({viewMode === 'html' ? 'HTML' : 'Text'} Mode)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={toggleViewMode}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {viewMode === 'html' ? 'Switch to Text' : 'Switch to HTML'}
                    </button>
                    {viewMode === 'text' && (
                      <span className="text-xs text-gray-500">
                        Use **bold** and *italic* for formatting
                      </span>
                    )}
                  </div>
                </div>
                <div className="border border-gray-300 rounded-md">
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full h-96 px-3 py-2 border-0 focus:outline-none focus:ring-0 resize-none"
                    placeholder={viewMode === 'html' ? 'Enter HTML content here...' : 'Enter text content here...'}
                    required
                  />
                </div>
                {viewMode === 'text' && (
                  <div className="mt-2 text-xs text-gray-500">
                    <strong>Text formatting:</strong> Use **bold text** for bold, *italic text* for italic, and line breaks will be converted to &lt;br&gt; tags.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Placeholders Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Placeholders</h2>
              
              <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {staticPlaceholders.map((placeholder, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertPlaceholder(placeholder)}
                    className="text-center px-2 py-2 text-xs bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-blue-600 bg-blue-100 rounded-full">
                        {index + 1}
                      </span>
                      <span className="font-mono text-blue-800 text-xs break-all">{`{{${placeholder}}}`}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-green-800">
                  <strong>Info:</strong> These placeholders are automatically available from your contact database. Click any placeholder to insert it into your email content.
                </p>
              </div>
              
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Placeholders will be automatically detected and added to the template tags when you save.
                </p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Template Updated Successfully!</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Your email template has been updated and saved successfully.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/email-campaign/email-templates');
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Back to Email Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
