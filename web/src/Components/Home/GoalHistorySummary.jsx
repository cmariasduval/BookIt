import { useState, useEffect } from 'react';

const GoalHistorySummary = () => {
    const [goalHistory, setGoalHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const monthNamesEs = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    useEffect(() => {
        fetchGoalHistory();
    }, []);

    const fetchGoalHistory = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8080/api/goals/monthly/history', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setGoalHistory(data);
            }
        } catch (err) {
            console.error('Error fetching goal history:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        if (goalHistory.length === 0) return null;

        const totalGoals = goalHistory.length;
        const completedGoals = goalHistory.filter(goal => goal.booksRead >= goal.targetBooks).length;
        const totalBooksTarget = goalHistory.reduce((sum, goal) => sum + goal.targetBooks, 0);
        const totalBooksRead = goalHistory.reduce((sum, goal) => sum + goal.booksRead, 0);
        const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

        return {
            totalGoals,
            completedGoals,
            totalBooksTarget,
            totalBooksRead,
            completionRate
        };
    };

    const stats = calculateStats();

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading history...</div>;
    }

    if (goalHistory.length === 0) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
            }}>
                <p style={{ color: '#6b7280' }}>No reading goals history available.</p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
        }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 16px 0' }}>
                    Reading Goals Summary
                </h3>

                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                                {stats.totalGoals}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                                Total Goals
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                                {stats.completedGoals}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                                Completed
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>
                                {stats.totalBooksRead}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                                Books Read
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                                {stats.completionRate.toFixed(0)}%
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                                Success Rate
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>
                    RECENT GOALS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {goalHistory.slice(0, 5).map((goal) => {
                        const isCompleted = goal.booksRead >= goal.targetBooks;
                        const completionPercentage = (goal.booksRead / goal.targetBooks) * 100;

                        return (
                            <div
                                key={`${goal.year}-${goal.month}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 0',
                                    borderBottom: '1px solid #f3f4f6'
                                }}
                            >
                                <div>
                  <span style={{ fontWeight: '500', color: '#374151' }}>
                    {monthNamesEs[goal.month - 1]} {goal.year}
                  </span>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                        {goal.booksRead} / {goal.targetBooks} books
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '4px',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '2px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${Math.min(completionPercentage, 100)}%`,
                                            height: '100%',
                                            backgroundColor: isCompleted ? '#10b981' : '#3b82f6'
                                        }} />
                                    </div>

                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: isCompleted ? '#10b981' : '#6b7280'
                                    }}>
                    {isCompleted ? '✅' : `${completionPercentage.toFixed(0)}%`}
                  </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GoalHistorySummary;