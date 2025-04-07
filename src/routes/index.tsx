import { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box } from "@gluestack-ui/themed";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { AuthContext } from "@contexts/AuthContext";
import { useAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";

export function Routes() {
  // bg geral da aplicação
  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  // precisamos do useContext para acessar o conteúdo do contexto
  // const contextData = useContext(AuthContext);
  // console.log("usuário logado =>", contextData);
  // criamos nosso hook
  const { user, isLoadingUserStorageData } = useAuth();
  // console.log("usuário logado =>", user);

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    // o box por volta é para evitar que a tela fique branca qd muda a rota
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
