"use client";

import { useState, useMemo } from 'react';

export default function Dashboard({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJobId, setSelectedJobId] = useState(initialJobs[0]?.id_job || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all'); // 'all', 'hot', 'new'
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'applicants'

  // Extract unique locations and categories for filters dynamically
  const locations = useMemo(() => {
    const set = new Set();
    initialJobs.forEach(job => {
      if (job.locations && job.locations.data) {
        job.locations.data.forEach(loc => {
          if (loc.attributes && loc.attributes.name) {
            set.add(loc.attributes.name);
          }
        });
      }
    });
    return Array.from(set);
  }, [initialJobs]);

  const categories = useMemo(() => {
    const set = new Set();
    initialJobs.forEach(job => {
      if (job.job_types && job.job_types.data) {
        job.job_types.data.forEach(cat => {
          if (cat.attributes && cat.attributes.name) {
            set.add(cat.attributes.name);
          }
        });
      }
    });
    return Array.from(set);
  }, [initialJobs]);

  // Filter jobs based on search query, locations, categories, and badges
  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      // 1. Search Query
      const matchSearch = 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.id_job?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_description?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Location
      let matchLocation = true;
      if (locationFilter !== 'all') {
        matchLocation = job.locations?.data?.some(
          loc => loc.attributes?.name === locationFilter
        );
      }

      // 3. Category
      let matchCategory = true;
      if (categoryFilter !== 'all') {
        matchCategory = job.job_types?.data?.some(
          cat => cat.attributes?.name === categoryFilter
        );
      }

      // 4. Badges (Hot / New)
      let matchBadge = true;
      if (badgeFilter === 'hot') {
        matchBadge = job.is_hot === true;
      } else if (badgeFilter === 'new') {
        matchBadge = job.is_new === true;
      }

      return matchSearch && matchLocation && matchCategory && matchBadge;
    });
  }, [initialJobs, searchQuery, locationFilter, categoryFilter, badgeFilter]);

  // Selected job details
  const selectedJob = useMemo(() => {
    return initialJobs.find(job => job.id_job === selectedJobId) || filteredJobs[0] || null;
  }, [initialJobs, selectedJobId, filteredJobs]);

  // Update selected job if it gets filtered out
  const displayJob = selectedJob;

  // Stats calculation
  const totalJobsCount = initialJobs.length;
  const totalApplicantsCount = useMemo(() => {
    return initialJobs.reduce((acc, job) => acc + (job.job_applications?.length || 0), 0);
  }, [initialJobs]);

  const hotJobsCount = useMemo(() => {
    return initialJobs.filter(job => job.is_hot).length;
  }, [initialJobs]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo-section">
          <div className="logo-badge">Aha</div>
          <div className="logo-title">Ahamove Careers Dashboard</div>
        </div>
        
        <div className="header-stats">
          <div className="stat-header-item">
            <span className="stat-header-label">Total Jobs</span>
            <span className="stat-header-value">{totalJobsCount}</span>
          </div>
          <div className="stat-header-item">
            <span className="stat-header-label">Hot Openings</span>
            <span className="stat-header-value" style={{ color: '#ef4444' }}>{hotJobsCount}</span>
          </div>
          <div className="stat-header-item">
            <span className="stat-header-label">Total Applicants</span>
            <span className="stat-header-value" style={{ color: '#10b981' }}>{totalApplicantsCount}</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="dashboard-body">
        
        {/* Left Sidebar - Job List */}
        <aside className="sidebar-jobs">
          
          {/* Filters */}
          <div className="search-filter-section">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search jobs, ID, description..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-dropdowns">
              <select 
                className="filter-select"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              >
                <option value="all">⚡ All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select 
                className="filter-select"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">📂 All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="badge-filters">
              <button 
                className={`badge-filter-btn ${badgeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setBadgeFilter('all')}
              >
                All Jobs
              </button>
              <button 
                className={`badge-filter-btn ${badgeFilter === 'hot' ? 'active' : ''}`}
                onClick={() => setBadgeFilter('hot')}
              >
                🔥 Hot
              </button>
              <button 
                className={`badge-filter-btn ${badgeFilter === 'new' ? 'active' : ''}`}
                onClick={() => setBadgeFilter('new')}
              >
                ✨ New
              </button>
            </div>
          </div>

          {/* List Scroll */}
          <div className="jobs-list-scroll">
            {filteredJobs.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 20px', gap: '8px' }}>
                <span className="empty-state-title" style={{ fontSize: '1rem' }}>No jobs match filters</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try adjusting your search query or filters.</span>
              </div>
            ) : (
              filteredJobs.map(job => {
                const appCount = job.job_applications?.length || 0;
                const locNames = job.locations?.data?.map(l => l.attributes?.name).join(', ') || 'N/A';
                
                return (
                  <div 
                    key={job.id_job} 
                    className={`job-card ${displayJob?.id_job === job.id_job ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedJobId(job.id_job);
                      // Keep active tab or reset to info
                    }}
                  >
                    <div className="job-card-header">
                      <h4 className="job-card-title">{job.title}</h4>
                      <div className="job-card-badges">
                        {job.is_hot && <span className="badge badge-hot">Hot</span>}
                        {job.is_new && <span className="badge badge-new">New</span>}
                      </div>
                    </div>
                    
                    <div className="job-card-meta">
                      <div className="job-card-location">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{locNames}</span>
                      </div>
                      <span className="job-card-applicants">
                        {appCount} {appCount === 1 ? 'applicant' : 'applicants'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Detail View */}
        <main className="detail-view">
          {displayJob ? (
            <>
              {/* Job Header */}
              <div className="detail-header">
                <div className="detail-title-section">
                  <h2 className="detail-title">{displayJob.title}</h2>
                  <div className="detail-tags">
                    <span className="tag-item tag-item-primary">ID: {displayJob.id_job}</span>
                    {displayJob.salary && <span className="tag-item">💰 {displayJob.salary}</span>}
                    {displayJob.job_types?.data?.map(t => (
                      <span key={t.id} className="tag-item">📂 {t.attributes?.name}</span>
                    ))}
                    {displayJob.locations?.data?.map(l => (
                      <span key={l.id} className="tag-item">📍 {l.attributes?.name}</span>
                    ))}
                    {displayJob.expiry_date_of_application && (
                      <span className="tag-item" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                        📅 Expiry: {displayJob.expiry_date_of_application}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs Menu */}
              <nav className="tab-nav">
                <button 
                  className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Job Specification
                </button>
                <button 
                  className={`tab-button ${activeTab === 'applicants' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applicants')}
                >
                  Applicants ({displayJob.job_applications?.length || 0})
                </button>
              </nav>

              {/* Tab Scroll Content */}
              <div className="detail-content-scroll">
                
                {/* Info Tab */}
                {activeTab === 'info' && (
                  <div className="job-info-grid">
                    <div className="info-main-content">
                      
                      {displayJob.job_description && (
                        <section className="html-section">
                          <h3>Job Description</h3>
                          <div 
                            className="html-body"
                            dangerouslySetInnerHTML={{ __html: displayJob.job_description }}
                          />
                        </section>
                      )}

                      {displayJob.job_requirement && (
                        <section className="html-section">
                          <h3>Job Requirements</h3>
                          <div 
                            className="html-body"
                            dangerouslySetInnerHTML={{ __html: displayJob.job_requirement }}
                          />
                        </section>
                      )}

                      {displayJob.benefit && (
                        <section className="html-section">
                          <h3>Benefits & Perks</h3>
                          <div 
                            className="html-body"
                            dangerouslySetInnerHTML={{ __html: displayJob.benefit }}
                          />
                        </section>
                      )}

                    </div>

                    <div className="info-sidebar">
                      <div className="info-widget">
                        <h4 className="widget-title">General Info</h4>
                        <div className="widget-list">
                          <div className="widget-item">
                            <span className="widget-label">Application Email</span>
                            <span className="widget-value">{displayJob.application_email || 'N/A'}</span>
                          </div>
                          {displayJob.secondary_email_for_applications && (
                            <div className="widget-item">
                              <span className="widget-label">Secondary Email</span>
                              <span className="widget-value">{displayJob.secondary_email_for_applications}</span>
                            </div>
                          )}
                          <div className="widget-item">
                            <span className="widget-label">Published At</span>
                            <span className="widget-value">
                              {displayJob.publishedAt ? new Date(displayJob.publishedAt).toLocaleDateString('en-GB') : 'N/A'}
                            </span>
                          </div>
                          <div className="widget-item">
                            <span className="widget-label">Crawled Date</span>
                            <span className="widget-value">{displayJob.crawled_at || 'N/A'}</span>
                          </div>
                          <div className="widget-item">
                            <span className="widget-label">Views</span>
                            <span className="widget-value">{displayJob.views || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Applicants Tab */}
                {activeTab === 'applicants' && (
                  <div className="applicants-section">
                    <div className="applicants-summary">
                      <h3 className="applicants-count">
                        Applications Received: {displayJob.job_applications?.length || 0}
                      </h3>
                    </div>

                    {(!displayJob.job_applications || displayJob.job_applications.length === 0) ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <h4 className="empty-state-title">No applications yet</h4>
                        <p>Applications for this job position will appear here.</p>
                      </div>
                    ) : (
                      <div className="table-container">
                        <table className="applicants-table">
                          <thead>
                            <tr>
                              <th>Applicant Details</th>
                              <th>Contact</th>
                              <th>Applied Date</th>
                              <th>Status / Source</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayJob.job_applications.map(app => (
                              <tr key={app.application_id}>
                                <td>
                                  <div className="applicant-info">
                                    <span className="applicant-name">{app.name}</span>
                                    <span className="applicant-email">ID: {app.application_id}</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="applicant-info">
                                    <span>📞 {app.phone_number || 'N/A'}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>✉️ {app.email}</span>
                                  </div>
                                </td>
                                <td>
                                  {app.applied_date ? new Date(app.applied_date).toLocaleDateString('en-GB') : 'N/A'}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                    <span className={`applicant-status-badge ${
                                      app.status === 'Lọc CV' ? 'status-new' : 'status-review'
                                    }`}>
                                      {app.status || 'N/A'}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                      Source: {app.relative || 'Direct'}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  {app.cv_url ? (
                                    <a 
                                      href={app.cv_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="cv-button"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                      </svg>
                                      View CV
                                    </a>
                                  ) : (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No CV uploaded</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">💼</div>
              <h4 className="empty-state-title">Select a Job</h4>
              <p>Choose a job from the list on the left to inspect details and see applicant CVs.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
