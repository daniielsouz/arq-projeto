import style from './login.module.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import PageTitle from '../../components/PageTitle';
import Toast from '../../components/toast/Toast.jsx';

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info', key: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/Adm';

  function showToast(message, type = 'info') {
    setToast({ message, type, key: Date.now() });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro('');
    showToast('Acessando sua conta...', 'info');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        throw new Error('Login ou senha inválidos');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      setIsLoading(false);
      setToast({ message: '', type: 'info', key: Date.now() });

      navigate(from, { replace: true });
    } catch (err) {
      setIsLoading(false);
      setErro(err.message);
      setLogin('');
      setSenha('');
      showToast(err.message, 'error');
    }
  }

  return (
    <AnimatedPage>
      <PageTitle title="Login - Janaina Possamai" />
      <Toast key={toast.key} message={toast.message} type={toast.type} />
      <div className={style.loginContainer}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login">Login:</label>
            <input
              className="globalInput"
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={style.passwordVisibility} >
            <label htmlFor="password">Senha:</label>
            <input
              className="globalInput"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              className={style.buttonVisibility}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <img className={style.imgVisibility}
                src={showPassword ? '/img/visibility_off.svg' : '/img/visibility.svg'}
                alt={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              />
            </button>
          </div>
          <button className="globalButton" type="submit" disabled={isLoading} style={{ marginTop: '1.5rem' }}>
            {isLoading ? 'Acessando...' : 'Entrar'}
          </button>
        </form>
        {erro && <p style={{ color: 'red', marginTop: '1rem' }}>{erro}</p>}
      </div>
    </AnimatedPage>
  );
}
