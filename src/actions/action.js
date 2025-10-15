import { BASE_URL } from './BASE_URL';

/**
 * Get all data from API with pagination and filtering
 */
export const getAllData = async (params = {}) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      city, 
      list_name, 
      search, 
      has_emails_sent, 
      template_id,
      from_date
    } = params;
    
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    if (city) queryParams.append('city', city);
    if (list_name) queryParams.append('list_name', list_name);
    if (search) queryParams.append('search', search);
    if (has_emails_sent !== undefined) queryParams.append('has_emails_sent', has_emails_sent);
    if (template_id) queryParams.append('template_id', template_id);
    if (from_date) queryParams.append('from_date', from_date);
    
    
    const response = await fetch(`${BASE_URL}/infolist/data?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

/**
 * Get data by ID
 */
export const getDataById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/infolist/data/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error fetching data by ID:', error);
    throw error;
  }
};

/**
 * Get email status for a specific user
 */
export const getEmailStatus = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/infolist/email-status/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error fetching email status:', error);
    throw error;
  }
};

/**
 * Get template details by ID
 */
export const getTemplateById = async (templateId) => {
  try {
    // Try different possible endpoints
    const endpoints = [
      `${BASE_URL}/email-templates/${templateId}`,
      `${BASE_URL}/templates/${templateId}`,
      `${BASE_URL}/template/${templateId}`,
      `${BASE_URL}/email-template/${templateId}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`Template data from ${endpoint}:`, result);
          return result;
        }
      } catch (err) {
        console.log(`Failed to fetch from ${endpoint}:`, err.message);
        continue;
      }
    }
    
    throw new Error('All template endpoints failed');
    
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
};

/**
 * Get email templates
 */
export const getEmailTemplates = async (params = {}) => {
  try {
    const { category, isActive, slug, tags } = params;
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (isActive !== undefined) queryParams.append('isActive', isActive);
    if (slug) queryParams.append('slug', slug);
    if (tags) queryParams.append('tags', tags);
    
    const queryString = queryParams.toString();
    const url = `${BASE_URL}/email-templates${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
};

/**
 * Get email template by ID
 */
export const getEmailTemplateById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/email-templates/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error fetching email template by ID:', error);
    throw error;
  }
};


/**
 * Update email template by ID
 */
export const updateEmailTemplate = async (id, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/email-templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error updating email template:', error);
    throw error;
  }
};

/**
 * Create email template
 */
export const createEmailTemplate = async (templateData) => {
  try {
    const response = await fetch(`${BASE_URL}/email-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error creating email template:', error);
    throw error;
  }
};

/**
 * Send individual email
 */
export const sendIndividualEmail = async (emailData) => {
  try {
    const response = await fetch(`${BASE_URL}/email-send/individual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error sending individual email:', error);
    throw error;
  }
};

/**
 * Send bulk emails
 */
export const sendBulkEmails = async (emailData) => {
  try {
    const response = await fetch(`${BASE_URL}/email-send/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    throw error;
  }
};

/**
 * Get overall statistics
 */
export const getOverallStatistics = async () => {
  try {
    const response = await fetch(`${BASE_URL}/statistics/overall`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error fetching overall statistics:', error);
    throw error;
  }
};

/**
 * Get all lists statistics
 */
export const getAllListsStatistics = async () => {
  try {
    const response = await fetch(`${BASE_URL}/statistics/lists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error fetching lists statistics:', error);
    throw error;
  }
};

/**
 * Get all templates statistics
 */
export const getAllTemplatesStatistics = async () => {
  try {
    const response = await fetch(`${BASE_URL}/statistics/templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error fetching templates statistics:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics with real data
 */
export const getDashboardStatistics = async () => {
  // Try multiple possible endpoints
  const endpoints = [
    `${BASE_URL}/statisticsdashboard`,
    `${BASE_URL}/dashboard`,
    `${BASE_URL}/statistics/dashboard`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log('🔍 Trying dashboard endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Dashboard statistics fetched successfully from:', endpoint);
        console.log('📊 Dashboard data:', result);
        return result;
      } else {
        console.warn(`⚠️ Endpoint ${endpoint} returned status ${response.status}`);
        // Try to get error details
        try {
          const errorData = await response.json();
          console.error('❌ API Error Response:', errorData);
        } catch (parseError) {
          const responseText = await response.text();
          console.error('❌ Raw error response:', responseText);
        }
      }
    } catch (error) {
      console.error(`❌ Error with endpoint ${endpoint}:`, error.message);
      // Continue to next endpoint
    }
  }
  
  // If all endpoints failed, throw a comprehensive error
  throw new Error(`All dashboard endpoints failed. Tried: ${endpoints.join(', ')}`);
};