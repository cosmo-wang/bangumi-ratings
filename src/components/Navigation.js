import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import './Navigation.css';
import '../App.css';

function UserManagement() {
  const { authenticated, setAuthenticating, handleSignOut } = useAuthenticationContext();
  if (authenticated) {
    return <div id="user-management">
        <div className="text-button clickable" onClick={handleSignOut}>注销</div>
      </div>
  } else {
    return <div className="text-button clickable" onClick={() => setAuthenticating(true)}>登陆</div>
  }
}

function Navigation() {
  return (
    <Navbar sticky="top" expand="lg" id="navbar">
      <Navbar.Brand href="/">追番补番</Navbar.Brand>
      <Nav className="mr-auto" activeKey={window.location.pathname}>
        <Nav.Item><Nav.Link onClick={() => alert('hello')}>我的列表</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link>每月总结</Nav.Link></Nav.Item>
      </Nav>
      <UserManagement />
    </Navbar>
  );
}

export default Navigation;
