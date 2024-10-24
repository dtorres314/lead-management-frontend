import React, { useEffect, useState, useContext } from 'react';
import { fetchLeads, logout } from '../services/api'; // Import logout API
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(10);  // Default pagination size

    const { logout: logoutContext } = useContext(AuthContext); // Use context to clear user data on logout
    const navigate = useNavigate();

    // Fetch leads data with pagination
    useEffect(() => {
        setLoading(true);  // Show spinner when fetching data
        fetchLeads(page, perPage)
            .then(response => {
                setLeads(response.data.data);  // 'data' contains the leads
                setTotalPages(response.data.last_page);  // 'last_page' contains total pages
                setLoading(false);  // Hide spinner after data is fetched
            })
            .catch(error => {
                console.error('Failed to fetch leads', error);
                setLoading(false);  // Hide spinner even if there's an error
            });
    }, [page, perPage]);

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
        setPerPage(parseInt(e.target.value));  // Update pagination size
        setPage(1);  // Reset to page 1 when the pagination size changes
    };

    const handleLogout = () => {
        logout().then(() => {
            logoutContext(); // Clear user data from context
            navigate('/login'); // Redirect to login page
        });
    };

    // Display loading spinner when data is being fetched
    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h1>Lead Management</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>

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

                {/* Show first 3 pages */}
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

                {/* Show last 3 pages */}
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
