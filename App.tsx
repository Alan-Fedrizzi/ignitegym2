import { StatusBar } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { GluestackUIProvider, Text, Center } from "@gluestack-ui/themed";
// esse é o tema padrão
// import { config } from "@gluestack-ui/config";
// esse é o tema que alteramos
import { config } from "./config/gluestack-ui.config";

import { Loading } from "@components/Loading";
import { SignIn } from "@screens/SignIn";

export default function App() {
  // useFonts retorna um array, na primeira posição um boolean
  const [fonstLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    // GluestackUIProvider fornece os componentes para a aplicação
    // envolvemos tudo nele
    // config é para usar o tema padrão
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fonstLoaded ? <SignIn /> : <Loading />}
    </GluestackUIProvider>
  );
}

// 2 Component Library
// Criando a SignUp
