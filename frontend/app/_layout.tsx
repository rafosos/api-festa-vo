import { ThemeProvider } from "@/components/ThemeContext";
import { Stack } from "expo-router";
import { useFonts,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
   } from "@expo-google-fonts/inter";
import { Platform, StyleSheet,StatusBar, useColorScheme } from "react-native";
import { colors } from "@/utils/constants";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter_100Thin,
        Inter_200ExtraLight,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    return (
        <ToastProvider>
            <ThemeProvider>{  
                <Stack screenOptions={{
                    contentStyle: [styles.AndroidSafeArea, {backgroundColor: colors[useColorScheme() ?? "light"].background}], 
                    headerShown: false
                }}>
                    <Stack.Screen name="index"/>
                </Stack>
            }
            </ThemeProvider>
        </ToastProvider>
    )
}

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
});
