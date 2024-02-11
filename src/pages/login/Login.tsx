import React from 'react';
import { Button, Input } from '@material-tailwind/react';
import LOGO from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

/**
 * Component for the login page allowing users to log in with their credentials.
 * @returns {JSX.Element} The Login component structure.
 */
function Login() {
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const navigate = useNavigate();

  const handleLogin = () => {
    if (login == 'desenvolver@projetodesenvolve.com' || login == '123' && password == 'pd@02024' || password == '123') {
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
