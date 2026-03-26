import styled, { keyframes } from 'styled-components'

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

interface ISidebarWrapper {
  isOpen: boolean
}

export const SidebarWrapper = styled.div<ISidebarWrapper>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 52px;
  width: 400px;
  z-index: 98;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  animation: ${props => (props.isOpen ? slideIn : slideOut)} 0.28s ease forwards;

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #fafafa 0%, #fff 100%);

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;

      .ai-icon {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background: linear-gradient(135deg, #c20c0c 0%, #e63946 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
      }

      .header-title {
        font-size: 15px;
        font-weight: 600;
        color: #1d1d1f;
      }

      .rag-badge {
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 10px;
        background: #f0f0f0;
        color: #888;

        &.ready {
          background: #e8f5e9;
          color: #2e7d32;
        }
        &.loading {
          background: #fff3e0;
          color: #e65100;
        }
        &.error {
          background: #ffebee;
          color: #c62828;
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;

      .header-btn {
        width: 30px;
        height: 30px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: #666;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;

        &:hover {
          background: #f5f5f5;
          color: #333;
        }
      }
    }
  }

  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 2px;
    }
  }

  .welcome-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    text-align: center;
    animation: ${fadeIn} 0.4s ease;

    .welcome-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .welcome-title {
      font-size: 18px;
      font-weight: 600;
      color: #1d1d1f;
      margin-bottom: 8px;
    }

    .welcome-desc {
      font-size: 13px;
      color: #888;
      line-height: 1.6;
      max-width: 280px;
    }

    .mood-tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin-top: 20px;

      .mood-tag {
        padding: 6px 16px;
        border: 1px solid #e8e8e8;
        border-radius: 20px;
        background: #fafafa;
        color: #555;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #c20c0c;
          color: #c20c0c;
          background: #fef2f2;
        }
      }
    }
  }

  .settings-panel {
    padding: 16px;
    border-top: 1px solid #f0f0f0;

    .settings-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }

    .api-key-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 12px;
      outline: none;
      font-family: monospace;
      box-sizing: border-box;
      transition: border-color 0.2s;

      &:focus {
        border-color: #c20c0c;
      }
    }

    .settings-hint {
      font-size: 11px;
      color: #999;
      margin-top: 6px;
    }

    .close-settings-btn {
      margin-top: 10px;
      width: 100%;
      padding: 6px;
      border: none;
      border-radius: 8px;
      background: #f5f5f5;
      color: #666;
      font-size: 12px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
`

export const AIToggleButton = styled.button`
  position: fixed;
  right: 16px;
  bottom: 68px;
  z-index: 97;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #c20c0c 0%, #e63946 100%);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(194, 12, 12, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(194, 12, 12, 0.45);
  }

  &:active {
    transform: scale(0.95);
  }
`
