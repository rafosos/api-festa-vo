import { fonts } from "@/utils/constants";
import { ForwardedRef, forwardRef } from "react"
import { TextInput, TextInputProps } from "react-native";
import { useTheme } from "./ThemeContext";

const StyledTextInput = forwardRef(function ({style, ...props}: TextInputProps, ref: ForwardedRef<TextInput>){
    const {textColor} = useTheme();

    return <TextInput ref={ref} style={[{fontFamily: fonts.padrao.Regular400, color: textColor}, style]} {...props} />
})

export default StyledTextInput;