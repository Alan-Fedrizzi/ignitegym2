import { StatusBar } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { GluestackUIProvider } from "@gluestack-ui/themed";
// esse é o tema padrão
// import { config } from "@gluestack-ui/config";
// esse é o tema que alteramos
import { config } from "./config/gluestack-ui.config";

import { Routes } from "@routes/index";
import { Loading } from "@components/Loading";

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
      {fonstLoaded ? <Routes /> : <Loading />}
    </GluestackUIProvider>
  );
}

// API
// cd api
// npm start
// roda na porta 3333
// documentação:
// http://localhost:3333/api-docs/

// Beekeeper
// connection type: SQLite
// chose file: api/src/database/database.db
// connect
// na esquerda, clica com o botão direito do mouse > view data

// test@test.com
// 123456

// 3 http client
// utlizando axios
// obs: sobre a aplicação tem a apllicação inicial desse módulo
