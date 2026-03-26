import styled from 'styled-components'

export const ChatInputWrapper = styled.div`
  padding: 12px;
  border-top: 1px solid #eee;
  background: #fff;

  .input-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;

    textarea {
      flex: 1;
      resize: none;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 13px;
      line-height: 1.5;
      min-height: 38px;
      max-height: 120px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.2s;

      &:focus {
        border-color: #c20c0c;
      }

      &::placeholder {
        color: #bbb;
      }
    }

    .send-btn {
      flex-shrink: 0;
      width: 38px;
      height: 38px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #c20c0c 0%, #e63946 100%);
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s, transform 0.15s;

      &:hover {
        opacity: 0.9;
        transform: scale(1.04);
      }

      &:active {
        transform: scale(0.96);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  .stop-btn {
    width: 100%;
    margin-top: 8px;
    padding: 6px;
    border: 1px solid #e63946;
    border-radius: 8px;
    background: #fff;
    color: #e63946;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #fef2f2;
    }
  }
`
