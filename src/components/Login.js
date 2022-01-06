import React from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import "./Login.css";
import "../App.css";

export default function Login() {
  const { username, password, setAuthenticating, setUsername, setPassword, handleLogin } = useAuthenticationContext();

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  }

  return (
    <div className="Login">
      <Box
        onSubmit={handleLogin}
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1.3 },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          fullWidth
          id="username"
          label="用户名"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          id="password"
          type="password"
          label="密码"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-group">
          <Button variant='contained' type="submit" disabled={!validateForm()}>
            登录
          </Button>
          <Button variant='contained' type="submit" onClick={() => setAuthenticating(false)}>
            取消
          </Button>
        </div>
      </Box>
    </div>
  );
}