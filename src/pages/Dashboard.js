import React, { useEffect, useState, useContext } from 'react';
import { fetchLeads, fetchStatuses, addLead, updateLead, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';  // Import the Modal component

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', lead_status_id: '' });
    const [editingLead, setEditingLead] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { logout: logoutContext } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch lead data
    const fetchLeadsData = () => {
        setLoading(true);
        fetchLeads(page, perPage, searchQuery, selectedStatus)
            .then(response => {
                setLeads(response.data.data);
                setTotalPages(response.data.last_page);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch leads', error);
                setLoading(false);
            });
    };

    // Fetch lead statuses for filtering
    const fetchStatusesData = () => {
        fetchStatuses().then(response => {
            setStatuses(response.data);
        });
    };

    useEffect(() => {
        fetchLeadsData();
        fetchStatusesData();
    }, [page, perPage, selectedStatus]);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePageInput = (e) => {
        let pageNum = parseInt(e.target.value);
        if (pageNum >= 1 && pageNum <= totalPages) {
            setPage(pageNum);
        }
    };

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
        setPage(1);
    };

    const handleSearchClick = () => {
        setPage(1);
        fetchLeadsData();
    };

    const handleFilterChange = (e) => {
        setSelectedStatus(e.target.value);
        setPage(1);
    };

    const handleAddLead = () => {
        setEditingLead(null);
        setFormData({ name: '', email: '', phone: '', lead_status_id: '' });
        setShowModal(true);
    };

    const handleEditLead = (lead) => {
        setEditingLead(lead.id);
        setFormData({ name: lead.name, email: lead.email, phone: lead.phone, lead_status_id: lead.lead_status_id });
        setShowModal(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingLead) {
            updateLead(editingLead, formData).then(() => {
                setShowModal(false);
                fetchLeadsData();
            });
        } else {
            addLead(formData).then(() => {
                setShowModal(false);
                fetchLeadsData();
            });
        }
    };

    const handleLogout = () => {
        logout().then(() => {
            logoutContext();
            navigate('/login');
        });
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1>Lead Management</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>

            <div className="search-container">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="search-input"
                />
                <button onClick={handleSearchClick} className="search-button">Search</button>
            </div>

            <div className="filter-container">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select id="statusFilter" value={selectedStatus} onChange={handleFilterChange}>
                    <option value="">All</option>
                    {statuses.map(status => (
                        <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                </select>
            </div>

            <table className="leads-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead.id}>
                            <td>{lead.id}</td>
                            <td>{lead.name}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone}</td>
                            <td>{lead.status.name}</td>
                            <td>
                                <button onClick={() => handleEditLead(lead)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls and Add Lead Button */}
            <div className="pagination-controls">
                <div className="pagination-size">
                    <label htmlFor="perPage">Per Page:</label>
                    <select id="perPage" value={perPage} onChange={handlePerPageChange}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <button onClick={handlePrev} disabled={page <= 1}>Prev</button>

                {Array.from({ length: 3 }, (_, i) => i + 1).map((pageNum) =>
                    <button key={pageNum} onClick={() => setPage(pageNum)} disabled={page === pageNum}>
                        {pageNum}
                    </button>
                )}

                <span>...</span>
                <input
                    type="number"
                    value={page}
                    min="1"
                    max={totalPages}
                    onChange={handlePageInput}
                    className="page-input"
                />
                <span>...</span>

                {Array.from({ length: 3 }, (_, i) => totalPages - 2 + i).map((pageNum) =>
                    <button key={pageNum} onClick={() => setPage(pageNum)} disabled={page === pageNum}>
                        {pageNum}
                    </button>
                )}

                <button onClick={handleNext} disabled={page >= totalPages}>Next</button>

                {/* Move Add Lead Button here */}
                <button onClick={handleAddLead} className="add-lead-button">Add Lead</button>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <form onSubmit={handleFormSubmit} className="lead-form">
                        <h2>{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Name"
                            required
                        />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Phone"
                            required
                        />
                        <select
                            value={formData.lead_status_id}
                            onChange={(e) => setFormData({ ...formData, lead_status_id: e.target.value })}
                            required
                        >
                            <option value="">Select Status</option>
                            {statuses.map(status => (
                                <option key={status.id} value={status.id}>{status.name}</option>
                            ))}
                        </select>
                        <button type="submit">{editingLead ? 'Update Lead' : 'Add Lead'}</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
