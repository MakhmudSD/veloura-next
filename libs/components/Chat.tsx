// libs/components/Chat.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member | null;
}

// Keep it minimal; assert as Partial to avoid filling all Member fields
const AI_MEMBER = {
  _id: 'veloura-ai',
  memberNick: 'Veloura AI',
  memberFullName: 'Veloura Assistant',
  memberImage: '/img/icons/ai.png',
} as Partial<Member> as Member;

const Chat = () => {
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [messagesList, setMessagesList] = useState<MessagePayload[]>([
    { event: 'message', text: 'Welcome to Veloura ✨ How can I help?', memberData: AI_MEMBER },
  ]);
  const [onlineUsers, setOnlineUsers] = useState<number>(1); // AI online
  const textInput = useRef<HTMLInputElement>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const router = useRouter();
  const user = useReactiveVar(userVar);

  /** LIFECYCLES **/
  useEffect(() => {
    const timeoutId = setTimeout(() => setOpenButton(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setOpenButton(false);
  }, [router.pathname]);

  /** HANDLERS **/
  const handleOpenChat = () => setOpen((prev) => !prev);

  const getInputMessageHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  }, []);

  const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onClickHandler();
  };

  // Convert local messages to OpenAI format and stream back
  const sendToAI = async (history: MessagePayload[]) => {
    const toOpenAi = history.map((m) => ({
      role: m.memberData?._id === AI_MEMBER._id ? 'assistant' : 'user',
      content: m.text,
    }));

    const resp = await fetch('/api/ai/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: toOpenAi }),
    });
    if (!resp.body) throw new Error('No stream');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() || '';

      for (const c of chunks) {
        if (!c.startsWith('data:')) continue;
        const payload = c.slice(5).trim();
        if (!payload) continue;

        try {
          const parsed = JSON.parse(payload);

          if (parsed.error) {
            setMessagesList((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = {
                event: 'message',
                text: `⚠️ ${parsed.error}`,
                memberData: AI_MEMBER,
              };
              return copy;
            });
            return;
          }

          const { delta, done: finished } = parsed;
          if (delta) {
            setMessagesList((prev) => {
              const copy = [...prev];
              const lastIdx = copy.length - 1;
              copy[lastIdx] = {
                ...copy[lastIdx],
                text: (copy[lastIdx].text || '') + delta,
              };
              return copy;
            });
          }
          if (finished) return;
        } catch {
          // ignore partial json
        }
      }
    }
  };

  const onClickHandler = async () => {
    const text = messageInput.trim();
    if (!text) {
      sweetErrorAlert(Messages.error4);
      return;
    }
    if (streaming) return;

    const userMsg: MessagePayload = {
      event: 'message',
      text,
      memberData: user as Member,
    };
    const aiMsg: MessagePayload = {
      event: 'message',
      text: '',
      memberData: AI_MEMBER,
    };

    const next = [...messagesList, userMsg, aiMsg];
    setMessagesList(next);
    setMessageInput('');
    setStreaming(true);

    try {
      await sendToAI(next);
    } catch (err: any) {
      setMessagesList((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          event: 'message',
          text: 'Sorry—AI response failed. Please try again.',
          memberData: AI_MEMBER,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  /** RENDER **/
  return (
    <Stack className="chatting" >
      {openButton ? (
        <button
          className="chat-button"
          onClick={handleOpenChat}
          aria-label={open ? 'Close chat' : 'Open chat'}
          title={open ? 'Close chat' : 'Open chat'}
        >
          {open ? (
            <CloseFullscreenIcon />
          ) : (
            // Your PNG icon when closed
            <img src="/img/icons/chat-icon.png" alt="Chat" className="chat-icon-img" style={{ width: '82px', height: '102px' }} />	
          )}
        </button>
      ) : null}

      <Stack className={`chat-frame ${open ? 'open' : ''}`}>
        <Box className={'chat-top'} component={'div'}>
          <div style={{ fontFamily: 'Playfair Display, serif' }}>Veloura AI Chat</div>
          <RippleBadge style={{ margin: '-10px 0 0 2px' }} badgeContent={onlineUsers} />
        </Box>

        <Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
          <ScrollableFeed>
            <Stack className={'chat-main'}>
              <Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
                <div className={'welcome'}>Welcome to Live chat!</div>
              </Box>

              {messagesList?.map((ele: MessagePayload, index) => {
                const { text, memberData } = ele;
                const memberImage = memberData?.memberImage
                  ? (memberData.memberImage.startsWith?.('http') ? memberData.memberImage : `${REACT_APP_API_URL}/${memberData.memberImage}`)
                  : '/img/profile/defaultUser.svg';

                const isMe = memberData?._id === user?._id;
                const isAI = memberData?._id === AI_MEMBER._id;

                return isMe ? (
                  <Box
                    key={index}
                    component={'div'}
                    flexDirection={'row'}
                    style={{ display: 'flex' }}
                    alignItems={'flex-end'}
                    justifyContent={'flex-end'}
                    sx={{ m: '10px 0px' }}
                  >
                    <div className={'msg-right'}>{text}</div>
                  </Box>
                ) : (
                  <Box
                    key={index}
                    flexDirection={'row'}
                    style={{ display: 'flex' }}
                    sx={{ m: '10px 0px' }}
                    component={'div'}
                  >
                    <Avatar alt={memberData?.memberNick || 'User'} src={memberImage} />
                    <div
                      className={`msg-left ${
                        isAI && streaming && index === messagesList.length - 1 ? 'typing' : ''
                      }`}
                    >
                      {text || '…'}
                    </div>
                  </Box>
                );
              })}
            </Stack>
          </ScrollableFeed>
        </Box>

        <Box className={'chat-bott'} component={'div'}>
          <input
            ref={textInput}
            autoFocus={true}
            disabled={!open || streaming}
            placeholder={streaming ? 'Generating…' : 'Type message'}
            type={'text'}
            name={'message'}
            className={'msg-input'}
            value={messageInput}
            onChange={getInputMessageHandler}
            onKeyDown={getKeyHandler}
          />
          <button className={'send-msg-btn'} onClick={onClickHandler} disabled={streaming}>
            <SendIcon style={{ color: '#fff' }} />
          </button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Chat;
