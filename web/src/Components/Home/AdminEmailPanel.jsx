import React, { useState } from 'react';
import {
    FaEnvelope,
    FaPaperPlane,
    FaClock,
    FaExclamationTriangle,
    FaUser,
    FaCommentDots,
    FaCheckCircle,
    FaTimes,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import './AdminEmailPanel.css'; // Asegúrate de crear este archivo CSS

const AdminEmailPanel = () => {
    const [loading, setLoading] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [customEmail, setCustomEmail] = useState({
        email: '',
        subject: '',
        body: ''
    });
    const [showCustomForm, setShowCustomForm] = useState(false);

    // Obtener token de autenticación
    const token = localStorage.getItem("authToken");
    const API_BASE = 'http://localhost:8080/api/notifications';

    const handleEmailAction = async (endpoint, actionName) => {
        setLoading(prev => ({ ...prev, [endpoint]: true }));
        setMessage('');
        setMessageType('');

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.text();

            if (response.ok) {
                setMessage(result);
                setMessageType('success');
            } else {
                setMessage(`Error: ${result}`);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(`Error de conexión: ${error.message}`);
            setMessageType('error');
        } finally {
            setLoading(prev => ({ ...prev, [endpoint]: false }));
        }
    };

    const handleCustomEmail = async () => {
        if (!customEmail.email || !customEmail.subject || !customEmail.body) {
            setMessage('Todos los campos son obligatorios');
            setMessageType('error');
            return;
        }

        setLoading(prev => ({ ...prev, custom: true }));
        setMessage('');
        setMessageType('');

        try {
            const params = new URLSearchParams({
                email: customEmail.email,
                subject: customEmail.subject,
                body: customEmail.body
            });

            const response = await fetch(`${API_BASE}/send-custom?${params}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.text();

            if (response.ok) {
                setMessage(result);
                setMessageType('success');
                setCustomEmail({ email: '', subject: '', body: '' });
                setShowCustomForm(false);
            } else {
                setMessage(`Error: ${result}`);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(`Error de conexión: ${error.message}`);
            setMessageType('error');
        } finally {
            setLoading(prev => ({ ...prev, custom: false }));
        }
    };

    const emailActions = [
        {
            endpoint: '/send-all',
            name: 'Todas las Notificaciones',
            icon: FaEnvelope,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            description: 'Ejecuta todas las notificaciones programadas del sistema'
        },
        {
            endpoint: '/send-pickup-reminders',
            name: 'Recordatorios de Retiro',
            icon: FaClock,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            description: 'Notifica sobre libros listos para retirar'
        },
        {
            endpoint: '/send-return-reminders',
            name: 'Recordatorios de Devolución',
            icon: FaClock,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            description: 'Recuerda devolver libros próximos a vencer'
        },
        {
            endpoint: '/send-overdue-notifications',
            name: 'Libros Vencidos',
            icon: FaExclamationTriangle,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            description: 'Alerta sobre libros ya vencidos'
        },
        {
            endpoint: '/send-infraction-notifications',
            name: 'Notificaciones de Infracciones',
            icon: FaExclamationTriangle,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            description: 'Envía notificaciones de infracciones acumuladas'
        }
    ];

    return (
        <div className="email-panel-container">
            <div className="email-panel-header">
                <div className="header-content">
                    <div className="header-icon">
                        <FaEnvelope />
                    </div>
                    <div className="header-text">
                        <h1>Gestión de Notificaciones</h1>
                        <p>Administra y envía notificaciones por email a los usuarios</p>
                    </div>
                </div>
            </div>

            <div className="email-panel-content">
                {/* Mensaje de estado mejorado */}
                {message && (
                    <div className={`message-alert ${messageType}`}>
                        <div className="message-icon">
                            {messageType === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        </div>
                        <div className="message-text">{message}</div>
                        <button
                            className="message-close"
                            onClick={() => setMessage('')}
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}

                {/* Grid de acciones centrado */}
                <div className="actions-grid">
                    {emailActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <div key={action.endpoint} className="action-card" style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="card-content">
                                    <div className="card-header">
                                        <div className="card-icon">
                                            <Icon />
                                        </div>
                                        <h3>{action.name}</h3>
                                    </div>
                                    <p className="card-description">{action.description}</p>
                                    <button
                                        onClick={() => handleEmailAction(action.endpoint, action.name)}
                                        disabled={loading[action.endpoint]}
                                        className="action-button"
                                    >
                                        {loading[action.endpoint] ? (
                                            <>
                                                <div className="spinner"></div>
                                                <span>Enviando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                <span>Enviar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sección de email personalizado mejorada */}
                <div className="custom-email-section">
                    <div className="section-header">
                        <div className="section-title">
                            <FaCommentDots />
                            <h2>Email Personalizado</h2>
                        </div>
                        <button
                            onClick={() => setShowCustomForm(!showCustomForm)}
                            className={`toggle-button ${showCustomForm ? 'active' : ''}`}
                        >
                            {showCustomForm ? <FaEyeSlash /> : <FaEye />}
                            {showCustomForm ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>

                    <div className={`custom-form ${showCustomForm ? 'show' : 'hide'}`}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    <FaUser />
                                    Email del destinatario
                                </label>
                                <input
                                    type="email"
                                    value={customEmail.email}
                                    onChange={(e) => setCustomEmail(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="usuario@ejemplo.com"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <FaEnvelope />
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    value={customEmail.subject}
                                    onChange={(e) => setCustomEmail(prev => ({ ...prev, subject: e.target.value }))}
                                    placeholder="Asunto del email"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>
                                    <FaCommentDots />
                                    Mensaje
                                </label>
                                <textarea
                                    value={customEmail.body}
                                    onChange={(e) => setCustomEmail(prev => ({ ...prev, body: e.target.value }))}
                                    placeholder="Escribe tu mensaje personalizado aquí..."
                                    rows={4}
                                    className="form-textarea"
                                />
                            </div>
                            <div className="form-group full-width">
                                <button
                                    onClick={handleCustomEmail}
                                    disabled={loading.custom}
                                    className="custom-send-button"
                                >
                                    {loading.custom ? (
                                        <>
                                            <div className="spinner"></div>
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            <span>Enviar Email Personalizado</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEmailPanel;