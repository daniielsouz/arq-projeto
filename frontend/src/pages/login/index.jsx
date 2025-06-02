import style from './login.module.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import PageTitle from '../../components/PageTitle';

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const loginEnv = import.meta.env.VITE_LOGIN;
  const senhaEnv = import.meta.env.VITE_PASSWORD;


  const from = location.state?.from?.pathname || '/Adm';

  async function handleSubmit(e) {
    e.preventDefault();

    if (login === loginEnv && senha === senhaEnv) {
      localStorage.setItem('token', 'seu-token-aqui');
      navigate(from, { replace: true }); 
    } else {
      setErro('Login ou senha inválidos');
      setLogin('');
      setSenha('');
    }
  }

  return (
    <AnimatedPage>
    <PageTitle title="Login - Janaina Possamai" />
    <div className={style.loginContainer}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login: </label>
          <input 
            className='globalInput'
            id='login'
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            className='globalInput'
            type="password"
            id='password'
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
        </div>
        <button className='globalButton' type="submit">Entrar</button>
        {console.log(login, senha)}
      </form>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
    </AnimatedPage>
  );
}
