import React, { useEffect, useState } from "react";
import { Avatar, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, TeamOutlined, AppstoreAddOutlined, BarChartOutlined, ProfileOutlined, BlockOutlined, UserAddOutlined, FileDoneOutlined, WechatOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
import ChatIcon from '@mui/icons-material/Chat';
import { Icon } from '@ant-design/icons';
import { FileSearchOutlined } from '@ant-design/icons';

/////////////////////////////////////////////////////////////////////////////

const { Sider, Content } = Layout;

const roles = {
  ROLE_ADMIN: [
    {
      key: "general",
      label: "General",
      icon: <AppstoreAddOutlined />,
      subMenu: [
        { key: "dashboard", label: "Dashboard", linkTo: "/dashboard", icon: <BarChartOutlined />, },
        {
          key: "userManagement",
          label: "User Management",
          linkTo: "/admin-page",
          icon: <ProfileOutlined />,

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
          icon: <UserAddOutlined />,
        },
        { key: "evaluation", label: "Admin Evaluation", linkTo: "/evaluation", icon: <FileDoneOutlined /> },
        { key: "summary", label: "Summary", linkTo: "/admin-summary", icon: <ProfileOutlined /> },
        { key: "llmSummary", label: "Query", linkTo: "/llmAdminSummary", icon: <FileSearchOutlined /> },
        {key: "SelectedCandidates",label: "Selected Candidates", linkTo: "/SelectedCandidates", icon: <FileSearchOutlined /> }
      ],
    },
  ],
  ROLE_RECRUITER: [
    {
      key: "general",
      label: "General",
      icon: <AppstoreAddOutlined />,
      subMenu: [{ key: "kanban", label: "Kanban", linkTo: "/kanban-recurit", icon: <BlockOutlined /> }],
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
          icon: <WechatOutlined />,
        },

        { key: "summary", label: "Summary", linkTo: "/hrr-summary", icon: <ProfileOutlined /> },
      ],
    },
  ],
  ROLE_INTERVIEWER: [
    {
      key: "general",
      label: "General",
      icon: <AppstoreAddOutlined />,
      subMenu: [
        { key: "kanban", label: "Kanban", linkTo: "/kanban-Interviewer", icon: <BlockOutlined /> },
      ],
    },
    {
      key: "candidates",
      label: "Candidates",
      icon: <TeamOutlined />,
      subMenu: [{ key: "summary", label: "Summary", linkTo: "/tech-summary", icon: <ProfileOutlined /> }],
    },
  ],
};
// 
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
  const [role, setRole] = useState("");
  const imgurl2 = process.env.PUBLIC_URL + "./img/frlogo.png";

  const HandlerRole = (jobRole) => {
    if (jobRole === 'ROLE_ADMIN') {
      setRole('Admin');
    }


    else if (jobRole === 'ROLE_RECRUITER') {
      setRole('HR Recruiter');
    }
    else if (jobRole === 'ROLE_INTERVIEWER') {
      setRole('Tech Interviewer');
    }
  };


  const [name, setName] = useState("");
  const Handleuser = (username) => {
    if (username.length > 10) {
      setName(username.substring(0, 9) + '...');
    }
    else { setName(username); }
  };



  useEffect(() => {
    HandlerRole(jobRole); // Call HandlerRole when the component mounts or when jobRole changes
  }, [jobRole]); // Depend on jobRole so that HandlerRole is called whenever jobRole changes

  useEffect(() => {
    Handleuser(username); // Call HandlerRole when the component mounts or when jobRole changes
  }); // Depend on jobRole so that HandlerRole is called whenever jobRole changes





  return (
    <Layout style={{ minHeight: "100vh",  }}>
       <Sider
    width={250} // Set the initial width of the Sider
    collapsedWidth={80} // Set the width of the Sider when collapsed
    trigger={null} // Hide the default trigger button
    collapsible
    collapsed={collapsed}
    style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,

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
            <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px", paddingRight: "10px" }}>
              <img className="navbar-logo" src={imgurl2} alt="logo" />
              <h2 style={{ marginLeft: "10px", marginTop: "15px", fontWeight: 'normal' }}>HireFlow</h2>

            </div>
          )}
        </div>
        {/*  */}
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
              backgroundColor: "",
              display: "flex",
              alignItems: "center",
              marginTop: '1px',
              marginLeft: 7,
              marginRight: 7,
              padding: 5,
              paddingTop: '10px',
              paddingBottom: '10px',
              borderRadius: 0, // Add border radius for light curved corners
              borderBottom: '1px solid rgb(84, 116, 131)',
              // borderTop: '1px solid rgb(84, 116, 131)', 


            }}
          >
            <Avatar icon={<UserOutlined />} />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: 5,
              color: 'white',
              fontSize: '15px',
              fontWeight: 'normal',
              alignItems: 'center',
              justifyContent: 'center', // Center content horizontally
            }}>
              <span style={{ fontSize: '1.2em', fontWeight: 'lighter' }}>{name.toUpperCase()}</span>
              <span style={{ color: 'rgb(84, 116, 131)', paddingTop: '5px' }}>{role}</span>
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
            <Avatar style={{ backgroundColor: "rgb(112, 160, 209)", marginLeft: '10px' }} icon={<UserOutlined />} />
          </div>
        )}



<Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
  {roles[userRole]?.map((item) => (
    <React.Fragment key={item.key}>
      {/* Render General or Candidates as text */}
      <div style={{ paddingLeft: '10px', paddingTop: '25px', paddingBottom: '8px', color: 'rgba(255, 255, 255, 0.65)', fontSize:'19px', fontWeight:'lighter' }}>
        {!collapsed && item.icon}
        <span style={{ marginLeft: '8px' }}>{!collapsed && item.label}</span>
      </div>
      
      {/* Render submenu items */}
      {item.subMenu && item.subMenu.map((subItem) => (
        <Menu.Item key={subItem.key} theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Link to={subItem.linkTo}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize:'1.2em', fontWeight:'lighter' }}>
            <div style={{ marginRight: '5px' }}><span>{subItem.icon}</span></div> 
            {!collapsed && <span>{subItem.label}</span>}
          </div>
        </Link>
      </Menu.Item>
      
      ))}
    </React.Fragment>
  ))}
</Menu>
{!collapsed && (
    <div style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center", color: "white" }}>
      
      <h2 style={{ marginLeft: "10px", marginTop: "15px", fontWeight: "initial", fontSize:'15px', color:'rgb(84, 116, 131)' }}>by FocusR AI</h2>
      <h2 style={{ marginLeft: "10px", marginTop: "15px", fontSize:'10px', fontWeight: "initial", color:'rgb(84, 116, 131)'}}>V 0.0.1</h2>
    </div>
  )}

      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
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


// import React, { useEffect, useState } from "react";
// import { Avatar, Layout, Menu } from "antd";
// import { Link } from "react-router-dom";
// import { UserOutlined, TeamOutlined, AppstoreAddOutlined } from "@ant-design/icons";

// const { Sider, Content } = Layout;

// const roles = {
//   ROLE_ADMIN: [
//     { key: "dashboard", label: "Dashboard", linkTo: "/dashboard", icon: <AppstoreAddOutlined /> },
//     { key: "userManagement", label: "User Management", linkTo: "/admin-page", icon: <AppstoreAddOutlined /> }
//   ],
//   ROLE_RECRUITER: [
//     { key: "kanban", label: "Kanban", linkTo: "/kanban-recurit", icon: <AppstoreAddOutlined /> },
//     { key: "chat", label: "Chats", linkTo: "/chat-msg", icon: <TeamOutlined /> },
//     { key: "summary", label: "Summary", linkTo: "/hrr-summary", icon: <TeamOutlined /> }
//   ],
//   ROLE_INTERVIEWER: [
//     { key: "kanban", label: "Kanban", linkTo: "/kanban-Interviewer", icon: <AppstoreAddOutlined /> },
//     { key: "summary", label: "Summary", linkTo: "/tech-summary", icon: <TeamOutlined /> }
//   ]
// };

// const CustomLayout = ({ children }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [userRole, setUserRole] = useState("");

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setUserRole(storedRole);
//   }, []);

//   const username = localStorage.getItem("username");
//   const imgurl2 = process.env.PUBLIC_URL + "./img/frlogo.png";

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={(value) => setCollapsed(value)}
//         style={{
//           position: "fixed",
//           height: "100%",
//           left: 0,
//           width: collapsed ? 80 : 200,
//         }}
//       >
//         <div style={{ color: "white", height: "auto", width: "auto", paddingLeft: "10px", display: "flex", flexDirection: "column" }}>
//           {!collapsed && (
//             <div style={{ display: "flex", alignItems: "center", paddingLeft:"10px", paddingRight:"10px"}}>
//               <img className="navbar-logo" src={imgurl2} alt="logo" />
//               <h2 style={{ marginLeft:"10px", marginTop:"30px" }}>HireFlow</h2>
//             </div>
//           )}
//         </div>

//         {collapsed && (
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <img className="navbar-logo" src={imgurl2} alt="logo" />
//           </div>
//         )}

//         {!collapsed && (
//           <div style={{ backgroundColor: "rgb(16 51 85)", display: "flex", alignItems: "center", marginTop: 1, marginLeft: 7, marginRight: 7, padding: 5, borderRadius: 5 }}>
//             <Avatar icon={<UserOutlined />} />
//             <div style={{display:'flex', flexDirection:'column', marginLeft:10, color:'white'}}>
//               <span>{username}</span>
//             </div>
//           </div>
//         )}

//         {collapsed && (
//           <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
//             <Avatar style={{ backgroundColor: "rgb(112, 160, 209)", marginLeft:'10px'}} icon={<UserOutlined />} />
//           </div>
//         )}

//         <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
//           <Menu.Item key="general" icon={<AppstoreAddOutlined />}>
//             General
//           </Menu.Item>
//           {roles[userRole]?.map((item) =>
//             item.key === "dashboard" || item.key === "userManagement" ? (
//               <Menu.Item key={item.key} icon={item.icon}>
//                 <Link to={item.linkTo}>{item.label}</Link>
//               </Menu.Item>
//             ) : null
//           )}
//           <Menu.Item key="candidates" icon={<TeamOutlined />}>
//             Candidates
//           </Menu.Item>
//           {roles[userRole]?.map((item) =>
//             item.key !== "dashboard" && item.key !== "userManagement" ? (
//               <Menu.Item key={item.key} icon={item.icon}>
//                 <Link to={item.linkTo}>{item.label}</Link>
//               </Menu.Item>
//             ) : null
//           )}
//         </Menu>
//       </Sider>
//       <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
//         <Content style={{ transition: "padding-left 0.2s" }}>
//           {children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default CustomLayout;
