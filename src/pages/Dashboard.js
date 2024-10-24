import React, { useEffect, useState, useContext } from 'react';
import { fetchLeads, fetchStatuses, logout } from '../services/api'; // Import fetchLeads and fetchStatuses APIs
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [statuses, setStatuses] = useState([]); // To store the lead statuses
    const [selectedStatus, setSelectedStatus] = useState(''); // To store the selected status filter
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(10);  // Default pagination size
    const [searchQuery, setSearchQuery] = useState('');  // Search query state

    const { logout: logoutContext } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch lead data with pagination, search, and filter
    const fetchLeadsData = () => {
        setLoading(true);
        fetchLeads(page, perPage, searchQuery, selectedStatus) // Pass selectedStatus to the API
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

    // Fetch lead statuses for the filter dropdown
    const fetchStatusesData = () => {
        fetchStatuses().then(response => {
            setStatuses(response.data);
        });
    };

    useEffect(() => {
        fetchLeadsData();
        fetchStatusesData(); // Fetch statuses when the component loads
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
        setPage(1);  // Reset to page 1 when pagination size changes
    };

    const handleSearchClick = () => {
        setPage(1);
        fetchLeadsData();
    };

    const handleFilterChange = (e) => {
        setSelectedStatus(e.target.value);
        setPage(1);  // Reset to page 1 when the filter changes
    };

    const handleLogout = () => {
        logout().then(() => {
            logoutContext();
            navigate('/login');
        });
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1>Lead Management</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>

            {/* Search Field with Button */}
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

            {/* Filter by Lead Status */}
            <div className="filter-container">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select id="statusFilter" value={selectedStatus} onChange={handleFilterChange}>
                    <option value="">All</option>
                    {statuses.map(status => (
                        <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                </select>
            </div>

            {/* Table to display leads */}
            <table className="leads-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
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
            </div>
        </div>
    );
};

export default Dashboard;
