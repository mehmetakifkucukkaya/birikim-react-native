declare module '@rneui/themed' {
    export * from '@rneui/base';
    export { useTheme } from '@rneui/base';
}

declare module '@rneui/base' {
    export interface Theme {
        colors: {
            primary: string;
            secondary: string;
            success: string;
            warning: string;
            error: string;
            grey0: string;
            grey1: string;
            grey2: string;
            grey3: string;
            grey4: string;
            grey5: string;
            white: string;
            black: string;
        };
    }

    export interface ButtonProps {
        title?: string;
        onPress?: () => void;
        loading?: boolean;
        buttonStyle?: any;
        titleStyle?: any;
        icon?: any;
    }

    export interface CardProps {
        containerStyle?: any;
        children?: React.ReactNode;
    }

    export interface IconProps {
        name: string;
        type?: string;
        size?: number;
        color?: string;
        containerStyle?: any;
        onPress?: () => void;
    }

    export interface TextProps {
        style?: any;
        children?: React.ReactNode;
    }

    export interface LinearProgressProps {
        style?: any;
        value?: number;
        color?: string;
        trackColor?: string;
    }

    export const Button: React.FC<ButtonProps>;
    export const Card: React.FC<CardProps>;
    export const Icon: React.FC<IconProps>;
    export const Text: React.FC<TextProps>;
    export const LinearProgress: React.FC<LinearProgressProps>;
    export const useTheme: () => { theme: Theme };
}
