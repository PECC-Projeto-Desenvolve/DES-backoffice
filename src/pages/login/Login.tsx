import React from 'react';
import { Button, Input } from '@material-tailwind/react';
import LOGO from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    if (login == '123' && password == '321') {
      localStorage.setItem('authenticated', 'true');
      navigate('/home');
    }
  };

  return (
    <section className='flex h-screen w-screen flex-col items-center justify-center bg-[#0081DF]'>
      <img
        src={LOGO}
        className="mb-10 w-[25rem] select-none"
        style={{
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
      <div className='flex w-[25rem] flex-col gap-4 rounded-lg bg-white px-4 py-8 shadow-lg '>
        <Input
          crossOrigin={''}
          label='Login'
          className=''
          size='lg'
          onChange={(event) => setLogin(event.target.value)}
          value={login}
        />
        <Input
          crossOrigin={''}
          label='Senha'
          type={'password'}
          size='lg'
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <Button color='green' onClick={() => handleLogin()}>Acessar</Button>
      </div>
    </section>
  );
}

export default Login;
