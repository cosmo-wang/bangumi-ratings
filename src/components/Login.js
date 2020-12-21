import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Parse from 'parse';
import Button from "react-bootstrap/Button";
import { useAppContext } from "../Utils/AppContext";
import { setUserSession } from "../utils";
import "./Login.css";
import "../App.css";

export default function Login() {
  const { setUser, setToken } = useAppContext();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Create a new instance of the user class
    var user = Parse.User.logIn(username, password).then(function(user) {
        setUserSession(user, user.getSessionToken());
        setUser(JSON.stringify(user));
        setToken(user.getSessionToken());
        history.push("/");
    }).catch(function(error){
        alert(error.message);
    });
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
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