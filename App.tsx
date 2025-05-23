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
import { AuthContext, AuthContextProvider } from "@contexts/AuthContext";
import { Loading } from "@components/Loading";

export default function App() {
  // useFonts retorna um array, na primeira posição um boolean
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

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
      {/* vamos envolver tudo no nosso contexto */}
      {/* temos que passar o valor do contexto */}
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>

      {/* <AuthContext.Provider
        value={{
          user: {
            id: "1",
            name: "Rodrigo",
            email: "rodrigo@email.com",
            avatar: "rodrigo.png",
          },
        }}
      >
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContext.Provider> */}
    </GluestackUIProvider>
  );
}

// API
// cd api
// npm start ou npm run dev (atualiza automático qd tem alterações no backend, no código do backend)
// roda na porta 3333
// documentação:
// http://localhost:3333/api-docs/

// Beekeeper
// connection type: SQLite
// chose file: api/src/database/database.db
// connect
// na esquerda, clica com o botão direito do mouse > view data

// email@email.com - 123123
// test@test.com
// aiai@email.com
// 123456

// 8 refresh token
// variação de refresh token
// obs: sobre a aplicação tem a aplicação inicial desse módulo

// como colocar fotos no simulador...
// component library - 6 galeria de fotos - acessando album de fotos
