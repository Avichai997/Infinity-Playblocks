const App = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Security Playbook Builder</h1>
    <p>Client is running successfully!</p>
    <p>Backend API: {import.meta.env.VITE_API_URL || 'http://localhost:3001'}</p>
  </div>
);

export default App;
