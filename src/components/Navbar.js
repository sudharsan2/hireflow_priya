// Navbar.js
import React from 'react';
import './navbar.css';
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const Navbar = () => {
  const imgurl1 = process.env.PUBLIC_URL + './img/icon1.png';
  // const handleNotificationClick = () => {
  //   setShowNotificationModal(true);
  // };
  // const handleNotificationModalClose = () => {
  //   setShowNotificationModal(false);
  // };
  // const [showNotificationModal, setShowNotificationModal] = useState(false);
  // const [notificationCount, setNotificationCount] = useState(0);

  return (
    <div className="Navbar">
      {/* <span onClick={handleNotificationClick} className="nav-span">
        <NotificationsNoneOutlinedIcon />
        {notificationCount > 0 && (
          <span className="notification-count">{notificationCount}</span>  
        )}
      </span> */}
      {/* <Modal
        title="Notifications"
        visible={showNotificationModal}
        onCancel={handleNotificationModalClose}
        footer={null}

      >
        <Notification onClearNotification={handleClearNotification} />
      </Modal> */}
      <img src={imgurl1} alt="Logo" className="logo" />

    </div>
  );
};

export default Navbar;
