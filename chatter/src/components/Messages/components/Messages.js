import React, { useContext, useEffect, useCallback, useState } from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import config from '../../../config';
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages';
import TypingMessage from './TypingMessage';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import '../styles/_messages.scss';
import initial_message_bot from '../../../common/constants/initialBottyMessage';

const me = 'me';
const bot = 'bot';

const socket = io(
  config.BOT_SERVER_ENDPOINT,
  { transports: ['websocket', 'polling', 'flashsocket'] }
);

const initialMessage = {
  message: initial_message_bot,
  id: Date.now(),
  user: bot
};


function scrollDown() {
  const messageListComponent = document.getElementById('message-list');
  messageListComponent.scrollTo({ top: messageListComponent.scrollHeight, behavior: 'smooth' });
}
function Messages() {
  //hook to set messages
  const [message, setMess] = useState("");
  //hook to set messages list/array 
  const [messages, setMessages] = useState([initialMessage]);
  //hook for bot typing status, defaults to false
  const [botWritting, setBotWritting] = useState(false);
  //get the notification sound urls from config.js
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { setLatestMessage } = useContext(LatestMessagesContext);

  useEffect(() => {
    document.getElementById('user-message-input').focus();
    socket.on('bot-message', (message) => {
      //use hooks to set message
      //set botWritting to false
      setBotWritting(false);
      //setMessages List (append)
      messages.push({ message, user: bot, id: Date.now() })
      setMessages(messages)
      //set latest message for left bar to display, for bot user
      setLatestMessage(bot, message)
      //play receive notification
      playReceive();
      //scroll down on every new message
      scrollDown();
    })
    //listen to bot writting event and display typing message 
    socket.on('bot-typing', () => {
      setBotWritting(true);
      scrollDown()
    })

  }, [messages])
  //to call everytime the list is updated


  const sendMessage = useCallback(() => {
    //return if message is empty
    if (!message) { return; }
    //set messages list
    messages.push({ message, user: me, id: Date.now() })
    setMessages(messages);
    //play send sound
    playSend();
    //scroll down
    scrollDown();
    //emit user-message event and pass message to botty
    socket.emit('user-message', message);
    //set message state to empty
    setMess('');
    //clear input tag
    document.getElementById('user-message-input').value = '';
  }, [messages, message]);

  const onChangeMessage = ({ target: { value } }) => {
    setMess(value)
  };
  var messageArray = []

  messages.map((message, index) => {
    messageArray.push(<Message message={message} nextMessage={messages[index + 1]} botWritting={botWritting} />)
  })

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {messageArray}
        {botWritting ? <TypingMessage /> : null}
      </div>
      <Footer message={message} sendMessage={sendMessage} onChangeMessage={onChangeMessage} />
    </div>
  );
}

export default Messages;