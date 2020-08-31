import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navigation.css';

function Navigation() {
    return (
      <Navbar sticky="top" expand="lg" id="navbar">
        <Navbar.Brand href="/">追番补番</Navbar.Brand>
        <Nav className="mr-auto" activeKey={window.location.pathname}>
          <Nav.Item><Nav.Link href="/today">今日更新</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/list">我的列表</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/calendar">看番日历</Nav.Link></Nav.Item>
      </Nav>
      </Navbar>
    );
}

export default Navigation;
