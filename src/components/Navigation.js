import React from 'react';
import { useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAppContext } from "../Utils/AppContext";
import { removeUserSession } from "../utils";
import './Navigation.css';
import '../App.css';

function Navigation() {
  const { setUser, setToken } = useAppContext();
  const history = useHistory();

  const handleSignOut = () => {
    setUser(null);
    setToken(null);
    removeUserSession();
    history.push("/login");
  };

  return (
    <Navbar sticky="top" expand="lg" id="navbar">
      <Navbar.Brand href="/">追番补番</Navbar.Brand>
      <Nav className="mr-auto" activeKey={window.location.pathname}>
        <Nav.Item><Nav.Link href={process.env.PUBLIC_URL + "/"}>我的列表</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="/today">今日更新</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="/calendar">看番日历</Nav.Link></Nav.Item>
      </Nav>
    <div id="signout" className="clickable" onClick={handleSignOut}>注销</div>
    </Navbar>
  );
}

export default Navigation;
