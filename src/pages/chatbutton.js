import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const ChatButton = ({ onClick, ...rest }) => (
  <Button
    type="primary"
    icon={<MessageOutlined />}
    onClick={onClick}
    {...rest}
  >
    Chat
  </Button>
);

export default ChatButton;
