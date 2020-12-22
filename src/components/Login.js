import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAppContext } from "../Utils/AppContext";
import "./Login.css";
import "../App.css";

export default function Login() {
  const { username, password, setUsername, setPassword, handleLogin } = useAppContext();

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  }

  return (
    <div className="Login">
      <Form onSubmit={handleLogin}>
        <Form.Group size="lg" controlId="username">
          <Form.Label>用户名</Form.Label>
          <Form.Control
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>密码</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className="pink-button" block size="lg" type="submit" disabled={!validateForm()}>
          登陆
        </Button>
      </Form>
    </div>
  );
}