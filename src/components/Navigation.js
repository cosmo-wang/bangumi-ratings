import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAppContext } from "../Utils/AppContext";
import './Navigation.css';
import '../App.css';

function UserManagement() {
  const { authenticated, setAuthenticating, handleSignOut } = useAppContext();
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
        <Nav.Item><Nav.Link href={process.env.PUBLIC_URL + "/"}>我的列表</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="/today">今日更新</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="/calendar">看番日历</Nav.Link></Nav.Item>
      </Nav>
      <UserManagement />
    </Navbar>
  );
}

export default Navigation;
