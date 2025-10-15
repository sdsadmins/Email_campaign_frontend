'use client';

import { useState, useEffect } from 'react';
import { getEmailTemplates, sendIndividualEmail, sendBulkEmails } from '../../actions/action';

export default function EmailModal({ isOpen, onClose, userData, selectedUsers = [] }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    } else {
      // Reset state when modal closes
      setSelectedTemplate(null);
      setPreviewContent('');
      setSending(false);
      setSendSuccess(false);
      setSendError(null);
    }
  }, [isOpen]);

  // Update editor content when template changes
  useEffect(() => {
    if (selectedTemplate) {
      generatePreview(selectedTemplate);
    }
  }, [selectedTemplate, userData, selectedUsers]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const result = await getEmailTemplates();
      if (result.templates) {
        setTemplates(result.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    generatePreview(template);
  };

  const generatePreview = (template) => {
    if (!template) return;

    let content = template.content || '';
    let subject = template.subject || '';

    // Check if this is bulk sending (multiple users selected)
    const isBulkSending = selectedUsers && selectedUsers.length > 0;

    if (isBulkSending) {
      // For bulk emails, show preview with sample data from first user
      const sampleUser = selectedUsers[0];
      if (sampleUser) {
        content = replacePlaceholders(content, sampleUser);
        subject = replacePlaceholders(subject, sampleUser);
      }
    } else {
      // For individual emails, use the selected user data
      if (userData) {
        content = replacePlaceholders(content, userData);
        subject = replacePlaceholders(subject, userData);
      }
    }

    // Ensure content is properly formatted for display
    // If content is already HTML, use it as-is
    // If content is plain text, convert line breaks to HTML
    if (content && !content.includes('<')) {
      content = content.replace(/\n/g, '<br>');
    }
    
    // Ensure HTML content is not escaped
    if (content && content.includes('&lt;') && content.includes('&gt;')) {
      // Content is HTML encoded, decode it
      content = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'");
    }

    console.log('Generated content for preview:', content);
    console.log('Content type:', typeof content);
    console.log('Contains HTML tags:', content.includes('<'));
    console.log('Raw HTML content:', content);
    console.log('Is bulk sending:', isBulkSending);
    
    setPreviewContent({ content, subject, template });
  };

  const replacePlaceholders = (text, userData) => {
    if (!text || !userData) return text;

    return text.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
      const value = userData[placeholder];
      return value !== undefined ? value : match;
    });
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) return;
    
    try {
      setSending(true);
      setSendError(null);
      
      // Check if this is bulk sending (multiple users selected)
      const isBulkSending = selectedUsers && selectedUsers.length > 0;
      
      if (isBulkSending) {
        // Send individual emails to each selected user
        const results = [];
        const errors = [];
        
        for (const user of selectedUsers) {
          try {
            const emailData = {
              templateId: selectedTemplate._id,
              recipientEmail: user.email_first,
              placeholders: {
                full_name: user.full_name,
                email_first: user.email_first,
                email_second: user.email_second,
                phone: user.phone,
                company_phone: user.company_phone,
                url: user.url,
                job_title: user.job_title,
                company_name: user.company_name,
                company_domain: user.company_domain,
                company_id: user.company_id,
                city: user.city,
                linkedin_id: user.linkedin_id,
                list_name: user.list_name,
                mailsent: user.mailsent,
                sent_template_id: user.sent_template_id,
                email_status_id: user.email_status_id
              }
            };
            
            const result = await sendIndividualEmail(emailData);
            results.push({ user: user.email_first, result });
          } catch (error) {
            console.error(`Error sending email to ${user.email_first}:`, error);
            errors.push({ user: user.email_first, error: error.message });
          }
        }
        
        if (errors.length === 0) {
          setSendSuccess(true);
          console.log('All bulk emails sent successfully:', results);
        } else if (results.length > 0) {
          setSendSuccess(true);
          setSendError(`Sent to ${results.length} recipients, failed for ${errors.length} recipients`);
          console.log('Partial success:', { results, errors });
        } else {
          setSendError('Failed to send emails to any recipients');
          console.error('All emails failed:', errors);
        }
      } else {
        // Individual email sending
        if (!userData) return;
        
        const emailData = {
          templateId: selectedTemplate._id,
          recipientEmail: userData.email_first,
          placeholders: {
            full_name: userData.full_name,
            email_first: userData.email_first,
            email_second: userData.email_second,
            phone: userData.phone,
            company_phone: userData.company_phone,
            url: userData.url,
            job_title: userData.job_title,
            company_name: userData.company_name,
            company_domain: userData.company_domain,
            company_id: userData.company_id,
            city: userData.city,
            linkedin_id: userData.linkedin_id,
            list_name: userData.list_name,
            mailsent: userData.mailsent,
            sent_template_id: userData.sent_template_id,
            email_status_id: userData.email_status_id
          }
        };
        
        const result = await sendIndividualEmail(emailData);
        
        if (result.message) {
          setSendSuccess(true);
          console.log('Email sent successfully:', result);
        } else {
          setSendError(result.message || 'Failed to send email');
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSendError(error.message || 'An error occurred while sending email');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border-2 border-gradient-to-r from-blue-200 to-purple-200 w-11/12 max-w-4xl shadow-2xl rounded-xl bg-gradient-to-br from-white to-blue-50">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold">Send Email</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Template Selection */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <label className="block text-sm font-bold text-indigo-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Select Email Template
            </label>
            {loading ? (
              <div className="flex items-center justify-center py-6 bg-white rounded-lg border-2 border-dashed border-indigo-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-indigo-700 font-medium">Loading templates...</span>
              </div>
            ) : (
              <select
                value={selectedTemplate?._id || ''}
                onChange={(e) => {
                  const template = templates.find(t => t._id === e.target.value);
                  handleTemplateSelect(template);
                }}
                className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-800 font-medium shadow-sm hover:border-indigo-400 transition-all duration-200"
              >
                <option value="">Choose a template...</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name} ({template.category})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* User Data Summary */}
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {selectedUsers && selectedUsers.length > 0 ? 'Bulk Email Recipients' : 'Recipient Information'}
            </h4>
            {selectedUsers && selectedUsers.length > 0 ? (
              <div className="text-sm">
                <div className="mb-2"><strong>Total Recipients:</strong> {selectedUsers.length}</div>
                <div className="mb-2"><strong>List Name:</strong> {selectedUsers[0]?.list_name || 'N/A'}</div>
                <div className="mb-2"><strong>Sample Recipients:</strong></div>
                <div className="max-h-32 overflow-y-auto">
                  {selectedUsers.slice(0, 5).map((user, index) => (
                    <div key={index} className="text-xs text-gray-600 mb-1">
                      {user.full_name} ({user.email_first})
                    </div>
                  ))}
                  {selectedUsers.length > 5 && (
                    <div className="text-xs text-gray-500">... and {selectedUsers.length - 5} more</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Name:</strong> {userData?.full_name || 'N/A'}</div>
                <div><strong>Email:</strong> {userData?.email_first || 'N/A'}</div>
                <div><strong>Company:</strong> {userData?.company_name || 'N/A'}</div>
                <div><strong>Job Title:</strong> {userData?.job_title || 'N/A'}</div>
                <div><strong>City:</strong> {userData?.city || 'N/A'}</div>
                <div><strong>List:</strong> {userData?.list_name || 'N/A'}</div>
              </div>
            )}
          </div>

          {/* Email Preview */}
          {selectedTemplate && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Email Preview
                {selectedUsers && selectedUsers.length > 0 && (
                  <span className="ml-2 text-xs text-amber-600 font-normal bg-amber-100 px-2 py-1 rounded-full">
                    (Sample preview with first recipient's data)
                  </span>
                )}
              </h4>
              <div className="border-2 border-amber-300 rounded-lg p-4 bg-white shadow-sm">
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subject:</label>
                  <div className="text-sm font-medium text-gray-900 bg-gray-50 p-2 rounded">
                    {previewContent.subject}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Content:</label>
                  <div className="border border-gray-200 rounded p-3 bg-white max-h-96 overflow-y-auto">
                    <div 
                      className="text-sm text-gray-700 leading-relaxed"
                      style={{ 
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: '1.6'
                      }}
                      dangerouslySetInnerHTML={{ __html: previewContent.content }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success/Error Messages */}
          {sendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {selectedUsers && selectedUsers.length > 0 
                      ? `Emails sent successfully to ${selectedUsers.length} recipients!`
                      : 'Email sent successfully!'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {sendError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {sendError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 border-2 border-slate-400 rounded-lg hover:from-slate-300 hover:to-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {sendSuccess ? 'Close' : 'Cancel'}
            </button>
            {!sendSuccess && (
              <button
                onClick={handleSendEmail}
                disabled={!selectedTemplate || sending}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-600 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {sending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {selectedUsers && selectedUsers.length > 0 ? `Send to ${selectedUsers.length} Recipients` : 'Send Email'}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
