import React, { useEffect, useState } from "react";
import { Avatar, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, TeamOutlined, AppstoreAddOutlined } from "@ant-design/icons";

/////////////////////////////////////////////////////////////////////////////

const { Sider, Content } = Layout;

const roles = {
  ROLE_ADMIN: [
    {
      key: "general",
      label: "General",
      icon: <AppstoreAddOutlined />, 
      subMenu: [
        { key: "dashboard", label: "Dashboard", linkTo: "/dashboard" },
        {
          key: "userManagement",
          label: "User Management",
          linkTo: "/admin-page",
        },
      ],
    },

    {
      key: "candidates",
      label: "Candidates",
      icon: <TeamOutlined />,
      subMenu: [
        {
          key: "addCandidate",
          label: "New Candidates",
          linkTo: "/add-candidate",
        },
        { key: "evaluation", label: "Admin Evaluation", linkTo: "/evaluation" },
        { key: "summary", label: "Summary", linkTo: "/admin-summary" },
      ],
    },
  ],
  ROLE_RECRUITER: [
    {
      key: "general",
      label: "General",
      icon: <AppstoreAddOutlined />, 
      subMenu: [{ key: "kanban", label: "Kanban", linkTo: "/kanban-recurit" }],
    },
    {
      key: "candidates",
      label: "Candidates",
      icon: <TeamOutlined />,
      subMenu: [
        {
          key: "addCandidate",
          label: "Chats",
          linkTo: "/chat-msg",
        },

        { key: "summary", label: "Summary", linkTo: "/hrr-summary" },
      ],
    },
  ],
  ROLE_INTERVIEWER: [
    {
      key: "general",
      label: "General",
      icon: <AppstoreAddOutlined />, 
      subMenu: [
        { key: "kanban", label: "Kanban", linkTo: "/kanban-Interviewer" },
      ],
    },
    {
      key: "candidates",
      label: "Candidates",
      icon: <TeamOutlined />,
      subMenu: [{ key: "summary", label: "Summary", linkTo: "/tech-summary" }],
    },
  ],
};

const CustomLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Retrieve user role from localStorage
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole);
  }, []);
  const username = localStorage.getItem("username");
  const jobRole = localStorage.getItem("role");
//   const role = localStorage.getItem("role");

  const imgurl2 = process.env.PUBLIC_URL + "./img/frlogo.png";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: "fixed",
          height: "100%",
          left: 0,
          width: collapsed ? 80 : 200, // Set the width based on collapsed state
        }}
      >
        {/* Username section at the top */}
        <div
          style={{
            color: "white",
            height: "auto",
            width: "auto",
            paddingLeft: "10px",
            display: "flex",
            flexDirection: "column", // Change to column layout
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", paddingLeft:"10px",paddingRight:"10px"}}>
              <img className="navbar-logo" src={imgurl2} alt="logo" />
              <h2 style={{ marginLeft:"10px", marginTop:"30px" }}>HireFlow</h2>
              
            </div>
          )}
        </div>

        {collapsed && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img className="navbar-logo" src={imgurl2} alt="logo" />
          </div>
        )}

        {!collapsed && (
          <div
            style={{
              backgroundColor: "rgb(16 51 85)",
              display: "flex",
              alignItems: "center",
              marginTop: 1,
              marginLeft: 7,
              marginRight: 7,
              padding: 5,
              borderRadius: 5, // Add border radius for light curved corners
            }}
          >
            <Avatar icon={<UserOutlined />} />
            <div style={{display:'flex', flexDirection:'column', marginLeft:10, color:'white'}}>
            <span>{username}</span>
            </div>
            
          </div>
        )}
         {collapsed && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
              
            }}
          >
            <Avatar style={{ backgroundColor: "rgb(112, 160, 209)", marginLeft:'10px'}} icon={<UserOutlined />} />
          </div>
        )}

        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          {roles[userRole]?.map((item) =>
            item.subMenu ? (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon} // Use the icon property
                title={item.label}
              >
                {item.subMenu.map((subItem) => (
                  <Menu.Item key={subItem.key}>
                    <Link to={subItem.linkTo}>{subItem.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={<UserOutlined />}>
                <Link to={item.linkTo}>{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        <Content style={{ transition: "padding-left 0.2s" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
