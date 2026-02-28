import React from 'react';

export const GetHelp: React.FC = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', background: '#fff' }}>
            <h1 style={{ marginBottom: '16px', color: '#2c3e50' }}>Get Help</h1>
            <p style={{ marginBottom: '24px', color: '#555' }}>
                Need assistance or have questions? We're here to help! Please choose one of the options below to get in touch with our support team.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '16px' }}>
                    <a href="mailto:support@example.com" style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 'bold' }}>Email Support</a>
                    <span style={{ marginLeft: '8px', color: '#888' }}>izzysajol9@gmail.com</span>
                </li>
                <li style={{ marginBottom: '16px' }}>
                    <a href="tel:+1234567890" style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 'bold' }}>Call Us</a>
                    <span style={{ marginLeft: '8px', color: '#888' }}>0906-674-6949</span>
                </li>
                <li>
                    <a href="/faq" style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 'bold' }}>Visit FAQ</a>
                </li>
            </ul>
            <div style={{ marginTop: '32px', color: '#888', fontSize: '14px' }}>
                Our support team is available Monday to Friday, 9am - 6pm.
            </div>
        </div>
    );
};

export default GetHelp;
