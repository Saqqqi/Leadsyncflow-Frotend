import React, { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    siteName: 'Lead Sync Flow',
    siteEmail: 'admin@leadsyncflow.com',
    defaultRole: 'User',
    emailNotifications: true,
    pushNotifications: false,
    maintenanceMode: false,
    debugMode: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', formData);
    // Show success message
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          System Settings
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage your application settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="rounded-xl border overflow-hidden" 
               style={{ 
                 backgroundColor: 'var(--bg-secondary)', 
                 borderColor: 'var(--border-primary)' 
               }}>
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{ 
                    color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="rounded-xl border p-6" 
               style={{ 
                 backgroundColor: 'var(--bg-secondary)', 
                 borderColor: 'var(--border-primary)' 
               }}>
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  General Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={formData.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: 'var(--border-primary)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--accent-primary)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Site Email
                    </label>
                    <input
                      type="email"
                      value={formData.siteEmail}
                      onChange={(e) => handleInputChange('siteEmail', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: 'var(--border-primary)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--accent-primary)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Default User Role
                    </label>
                    <select
                      value={formData.defaultRole}
                      onChange={(e) => handleInputChange('defaultRole', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: 'var(--border-primary)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--accent-primary)'
                      }}
                    >
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Maintenance Mode
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Put the site in maintenance mode
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('maintenanceMode', !formData.maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Debug Mode
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Enable debug logging and error details
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('debugMode', !formData.debugMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.debugMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.debugMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Security Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border" 
                       style={{ 
                         backgroundColor: 'var(--bg-tertiary)', 
                         borderColor: 'var(--border-primary)' 
                       }}>
                    <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Password Policy
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Minimum length: 8 characters
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                          Edit
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Require special characters
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border" 
                       style={{ 
                         backgroundColor: 'var(--bg-tertiary)', 
                         borderColor: 'var(--border-primary)' 
                       }}>
                    <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Session Management
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Session timeout: 24 hours
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                          Edit
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Max concurrent sessions: 3
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border" 
                       style={{ 
                         backgroundColor: 'var(--bg-tertiary)', 
                         borderColor: 'var(--border-primary)' 
                       }}>
                    <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Enable 2FA for enhanced security
                    </p>
                    <button className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                            style={{ 
                              borderColor: 'var(--border-primary)',
                              color: 'var(--text-primary)'
                            }}>
                      Configure 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Notification Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Email Notifications
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Receive notifications via email
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('emailNotifications', !formData.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Push Notifications
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Receive browser push notifications
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('pushNotifications', !formData.pushNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.pushNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Notification Types
                  </h3>
                  
                  {[
                    'New user registration',
                    'Lead status changes',
                    'System alerts',
                    'Security notifications',
                    'Weekly reports'
                  ].map((type, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {type}
                      </span>
                      <button
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          true ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            true ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Integrations
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border" 
                       style={{ 
                         backgroundColor: 'var(--bg-tertiary)', 
                         borderColor: 'var(--border-primary)' 
                       }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">G</span>
                        </div>
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            Google Analytics
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Track website traffic and user behavior
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                              style={{ 
                                borderColor: 'var(--border-primary)',
                                color: 'var(--text-primary)'
                              }}>
                        Configure
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border" 
                       style={{ 
                         backgroundColor: 'var(--bg-tertiary)', 
                         borderColor: 'var(--border-primary)' 
                       }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 font-bold text-sm">S</span>
                        </div>
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            Stripe
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Payment processing and subscriptions
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                              style={{ 
                                borderColor: 'var(--border-primary)',
                                color: 'var(--text-primary)'
                              }}>
                        Configure
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border" 
                       style={{ 
                         backgroundColor: 'var(--bg-tertiary)', 
                         borderColor: 'var(--border-primary)' 
                       }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                          <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">M</span>
                        </div>
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            Mailchimp
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Email marketing and automation
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                              style={{ 
                                borderColor: 'var(--border-primary)',
                                color: 'var(--text-primary)'
                              }}>
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex justify-end gap-3">
                <button
                  className="px-6 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    boxShadow: '0 4px 12px rgba(69, 104, 130, 0.3)'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
