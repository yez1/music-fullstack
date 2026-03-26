import styled from 'styled-components'

export const QuickActionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #f0f0f0;

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border: 1px solid #e8e8e8;
    border-radius: 20px;
    background: #fafafa;
    color: #444;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    .action-icon {
      font-size: 14px;
    }

    &:hover {
      border-color: #c20c0c;
      color: #c20c0c;
      background: #fef2f2;
    }

    &:active {
      transform: scale(0.96);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      &:hover {
        border-color: #e8e8e8;
        color: #444;
        background: #fafafa;
      }
    }
  }
`
