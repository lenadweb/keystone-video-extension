import ReactDOM from 'react-dom/client';
import 'src/assets/styles/index.css';
import App from './App';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(<App />);
