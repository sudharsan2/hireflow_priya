import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

/////////////////////////////////////////////////////////////////////////////

const { Sider, Content } = Layout;

const roles = {
  ROLE_ADMIN: [
    {
      key: "general",
      label: "General",
      subMenu: [
        { key: "dashboard", label: "Dashboard", linkTo: "/dashboard" },
        {
          key: "userManagement",
          label: "User Management",
          linkTo: "/user-management",
        },
      ],
    },

    {
      key: "candidates",
      label: "Candidates",
      subMenu: [
        {
          key: "addCandidate",
          label: "New Candidates",
          linkTo: "/add-candidate",
        },
        { key: "evaluation", label: "Admin Evaluation", linkTo: "/evaluation" },
        { key: "summary", label: "Summary", linkTo: "/summary" },
      ],
    },
  ],
  ROLE_RECRUITER: [
    {
      key: "general",
      label: "General",
      subMenu: [{ key: "kanban", label: "Kanban", linkTo: "/kanban-recurit" }],
    },
    {
      key: "candidates",
      label: "Candidates",
      subMenu: [
        {
          key: "addCandidate",
          label: "New Candidates",
          linkTo: "/add-candidate",
        },

        { key: "summary", label: "Summary", linkTo: "/summary" },
      ],
    },
  ],
  ROLE_INTERVIEWER: [
    {
      key: "general",
      label: "General",
      subMenu: [
        { key: "kanban", label: "Kanban", linkTo: "/kanban-Interviewer" },
      ],
    },
    {
      key: "candidates",
      label: "Candidates",
      subMenu: [{ key: "summary", label: "Summary", linkTo: "/summary" }],
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
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "16px",
            marginBottom: "16px",
          }}
        >
          {collapsed ? <UserOutlined /> : username}
        </div>

        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          {roles[userRole]?.map((item) =>
            item.subMenu ? (
              <Menu.SubMenu
                key={item.key}
                icon={<TeamOutlined />}
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
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        <Content style={{ transition: "padding-left 0.2s" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
