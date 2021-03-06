import React, { useEffect, useState } from 'react'
import './Chat.css'

const URL = 'ws://127.0.0.1:8080';

export default function WebSocketDemo() {
    const [user, setUser] = useState('Tarzan');
    const [message, setMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(new WebSocket(URL));

    const submitMessage = (usr, msg) => {
        const message = { user: usr, message: msg };
        ws.send(JSON.stringify(message));
        setMessages([message, ...messages]);
    }

    useEffect(() => {
        ws.onopen = () => {
            console.log('WebSocket Connected');
        }

        ws.onmessage = async (e) => {
            const message = await e.data.text();
            // console.log(mess);
            setMessages([JSON.parse(message), ...messages]);
        }

        return () => {
            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                setWs(new WebSocket(URL));
            }
        }
    }, [ws.onmessage, ws.onopen, ws.onclose, messages]);

    return (
        <div>
            <label htmlFor="user">
                Name :
                <input
                    type="text"
                    id="user"
                    placeholder="User"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                />
            </label>

            <ul>
                {messages.reverse().map((message, index) =>
                    <li key={index}>
                        <b>{message.user}</b>: <em>{message.message}</em>
                    </li>
                )}
            </ul>

            <form
                action=""
                onSubmit={e => {
                    e.preventDefault();
                    submitMessage(user, message);
                    setMessage([]);
                }}
            >
                <input
                    type="text"
                    placeholder={'Type a message ...'}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <input type="submit" value={'Send'} />
            </form>
        </div>
    )
}
