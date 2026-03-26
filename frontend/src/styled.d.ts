import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      primary: string;
      secondary: string;
    };
    
    size: Record<string, any>;
    mixin: {
      wrapV1: string;
    };
  }
}

