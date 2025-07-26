import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MonthlyGoalStats = () => {
    const [goalStats, setGoalStats] = useState(null);
    const [monthlyGoal, setMonthlyGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [targetBooks, setTargetBooks] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const navigate = useNavigate();

    const months = [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' }
    ];

    const getCurrentYear = () => new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => getCurrentYear() - i);

    useEffect(() => {
        fetchGoalStats();
        fetchMonthlyGoal();
    }, [selectedMonth, selectedYear]);

    const fetchGoalStats = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const url = `http://localhost:8080/api/goals/monthly/stats?month=${selectedMonth}&year=${selectedYear}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setGoalStats(data);
            } else if (response.status === 404) {
                setGoalStats(null);
            }
        } catch (err) {
            setError('Error fetching goal statistics');
            console.error(err);
        }
    };

    const fetchMonthlyGoal = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const url = `http://localhost:8080/api/goals/monthly?month=${selectedMonth}&year=${selectedYear}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMonthlyGoal(data);
                setTargetBooks(data.bookCount.toString());
            } else {
                setMonthlyGoal(null);
                setTargetBooks('');
            }
        } catch (err) {
            console.error('Error fetching monthly goal:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGoal = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const method = monthlyGoal ? 'PUT' : 'POST';

            const requestBody = {
                bookCount: parseInt(targetBooks),
                month: selectedMonth,
                year: selectedYear,
                booksRead: monthlyGoal?.booksRead || 0
            };

            const response = await fetch('http://localhost:8080/api/goals/monthly', {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                setIsEditing(false);
                await fetchGoalStats();
                await fetchMonthlyGoal();
            } else {
                setError('Error saving goal');
            }
        } catch (err) {
            setError('Error saving goal');
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'achieved': return '#22c55e';
            case 'on_track': return '#3b82f6';
            case 'behind': return '#ef4444';
            case 'not_achieved': return '#ef4444';
            case 'not_started': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'achieved': return '🎉 Goal Achieved!';
            case 'on_track': return '✅ On Track';
            case 'behind': return '⚠️ Behind Schedule';
            case 'not_achieved': return '❌ Goal Not Achieved';
            case 'not_started': return '⏳ Not Started';
            default: return 'No Goal Set';
        }
    };

    const isCurrentMonth = () => {
        const now = new Date();
        return selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();
    };

    const isPastMonth = () => {
        const now = new Date();
        return selectedYear < now.getFullYear() ||
            (selectedYear === now.getFullYear() && selectedMonth < now.getMonth() + 1);
    };

    if (loading) return <div className="loading">Loading goal statistics...</div>;

    return (
        <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            {/* Month/Year Selector */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
            }}>
                <div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '8px'
                    }}>
                        Monthly Reading Goal
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Track your reading progress
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Goal Setting Section - Only show for current/future months */}
            {!isPastMonth() && (
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: 0 }}>
                            Goal Setting
                        </h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => navigate('/set-goal')}
                                style={{
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {monthlyGoal ? 'Update Goal' : 'Set Goal'}
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                style={{
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {isEditing ? 'Cancel' : 'Quick Edit'}
                            </button>
                        </div>
                    </div>

                    {isEditing ? (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="number"
                                value={targetBooks}
                                onChange={(e) => setTargetBooks(e.target.value)}
                                placeholder="Target books"
                                min="1"
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    width: '120px'
                                }}
                            />
                            <span style={{ color: '#6b7280' }}>books this month</span>
                            <button
                                onClick={handleSaveGoal}
                                style={{
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <p style={{ color: '#374151', margin: 0 }}>
                            Target: <strong>{monthlyGoal?.bookCount || 0}</strong> books for {months[selectedMonth - 1]?.name} {selectedYear}
                        </p>
                    )}
                </div>
            )}

            {goalStats ? (
                <>
                    {/* Progress Overview */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: 0 }}>
                                Progress Overview - {months[selectedMonth - 1]?.name} {selectedYear}
                            </h3>
                            <span style={{
                                color: getStatusColor(goalStats.status),
                                fontWeight: '600',
                                fontSize: '14px'
                            }}>
                                {getStatusText(goalStats.status)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{
                                width: '100%',
                                height: '12px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '6px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(goalStats.progressPercentage, 100)}%`,
                                    backgroundColor: getStatusColor(goalStats.status),
                                    transition: 'width 0.5s ease-in-out'
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                                <span>{goalStats.booksRead} read</span>
                                <span>{goalStats.progressPercentage.toFixed(1)}%</span>
                                <span>{goalStats.targetBooks} target</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '16px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                                    {goalStats.booksRead}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                                    Books Read
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                                    {goalStats.booksRemaining}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                                    Remaining
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                                    {goalStats.daysRemaining}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                                    Days {isPastMonth() ? 'Were' : 'Left'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                                    {goalStats.currentPace.toFixed(1)}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                                    {isPastMonth() ? 'Final Pace' : 'Current Pace'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                            Reading Analysis
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                    PACE ANALYSIS
                                </h4>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                                    <strong>{isPastMonth() ? 'Final pace:' : 'Current pace:'}</strong> {goalStats.currentPace.toFixed(2)} books/day
                                </p>
                                {!isPastMonth() && (
                                    <>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                                            <strong>Needed pace:</strong> {goalStats.dailyPaceNeeded.toFixed(2)} books/day
                                        </p>
                                        {goalStats.daysRemaining > 0 && (
                                            <p style={{ margin: 0, fontSize: '14px', color: goalStats.currentPace >= goalStats.dailyPaceNeeded ? '#10b981' : '#ef4444' }}>
                                                {goalStats.currentPace >= goalStats.dailyPaceNeeded
                                                    ? '✅ You\'re reading fast enough!'
                                                    : '⚠️ You need to pick up the pace'
                                                }
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                    TIME INFORMATION
                                </h4>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                                    <strong>Days in month:</strong> {goalStats.daysInMonth}
                                </p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                                    <strong>Days {isPastMonth() ? 'were' : 'remaining'}:</strong> {goalStats.daysRemaining}
                                </p>
                                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                                    {isPastMonth()
                                        ? (goalStats.isAchieved
                                            ? 'Goal was achieved!'
                                            : `Goal was not achieved. Read ${goalStats.booksRead} of ${goalStats.targetBooks} books`)
                                        : (goalStats.daysRemaining > 0
                                            ? `You have ${goalStats.daysRemaining} days to read ${goalStats.booksRemaining} more books`
                                            : goalStats.isAchieved
                                                ? 'Congratulations on achieving your goal!'
                                                : 'Month ended - better luck next time!')
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                }}>
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                        No monthly goal set for {months[selectedMonth - 1]?.name} {selectedYear}.
                    </p>
                    {!isPastMonth() && (
                        <button
                            onClick={() => navigate('/setGoal')}
                            style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Set Monthly Goal
                        </button>
                    )}
                </div>
            )}

            {error && (
                <div style={{
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    padding: '12px',
                    borderRadius: '6px',
                    marginTop: '16px',
                    border: '1px solid #fecaca'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default MonthlyGoalStats;