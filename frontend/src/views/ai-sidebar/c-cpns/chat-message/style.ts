import styled, { keyframes, css } from 'styled-components'

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

interface IMessageBubble {
  isUser: boolean
}

export const MessageWrapper = styled.div<IMessageBubble>`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 16px;
  padding: 0 12px;

  .message-label {
    font-size: 11px;
    color: #999;
    margin-bottom: 4px;
    padding: 0 4px;
  }

  .message-bubble {
    max-width: 92%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13.5px;
    line-height: 1.6;
    word-break: break-word;

    ${props =>
      props.isUser
        ? css`
            background: linear-gradient(135deg, #c20c0c 0%, #e63946 100%);
            color: #fff;
            border-bottom-right-radius: 4px;
          `
        : css`
            background: #f5f5f7;
            color: #1d1d1f;
            border-bottom-left-radius: 4px;
          `}

    p { margin: 0 0 8px; }
    p:last-child { margin-bottom: 0; }

    h1, h2, h3, h4 {
      margin: 12px 0 6px;
      &:first-child { margin-top: 0; }
    }

    h3 { font-size: 14px; }
    h4 { font-size: 13px; }

    ul, ol {
      padding-left: 20px;
      margin: 6px 0;
    }

    li { margin-bottom: 4px; }

    code {
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 12px;
    }

    pre {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 10px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 12px;
      margin: 8px 0;

      code {
        background: none;
        padding: 0;
        color: inherit;
      }
    }

    strong { font-weight: 600; }

    .song-link {
      color: ${props => (props.isUser ? '#ffe0e0' : '#c20c0c')};
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .streaming-cursor {
    display: inline-block;
    width: 2px;
    height: 14px;
    background: #c20c0c;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: ${blink} 0.8s ease-in-out infinite;
  }
`
