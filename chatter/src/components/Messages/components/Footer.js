import React from 'react';
import config from '../../../config';
import '../styles/_messages.scss';

const RETURN_KEY_CODE = 13;

export default function Footer({ sendMessage, onChangeMessage, message }) {
  const onKeyDown = ({ keyCode }) => {
    if (keyCode !== RETURN_KEY_CODE) { return; }

    sendMessage();
  }
  function handleClick({ target: { value } }) {
    document.getElementById('user-message-input').value = value;
    document.getElementById('user-message-input').focus();
    //an attempt to dispatch event manually (not working)
    // const element = document.getElementById('user-message-input');
    // element.addEventListener('onChange', () => onChangeMessage)
    // const event = new Event('onChange');
    // element.dispatchEvent(event);
  }

  //add suggestion buttons
  const suggestions = config.SUGGESTIONS_DEFAULT
  const suggestButtons = []
  suggestions.map((suggestion, index) => {
    suggestButtons.push(<button onClick={handleClick} value={suggestion}> {suggestion}</button>)
  })


  return (
    <>
      <div className="suggestions">
        {suggestButtons}
      </div>
      <div className="messages__footer">

        <input
          onKeyDown={onKeyDown}
          placeholder="Write a message..."
          id="user-message-input"
          onChange={onChangeMessage}
        />
        <div className="messages__footer__actions">
          <i className="far fa-smile" />
          <i className="fas fa-paperclip" />
          <i className="mdi mdi-ticket-outline" />
          <button id='submit' onClick={sendMessage} disabled={!message}>Send</button>
        </div>
      </div>
    </>
  );
}
