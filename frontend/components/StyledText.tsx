import { Text, TextProps } from "react-native";
import { useTheme } from "./ThemeContext";
import { fonts } from "@/utils/constants";

export default function StyledText({style, children, ...props}: TextProps){
    const {textColor} = useTheme();
    
    return <Text style={[{fontFamily: fonts.padrao.Regular400, color: textColor}, style]} {...props}>{children}</Text>
} 