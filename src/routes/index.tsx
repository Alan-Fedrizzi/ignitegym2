import { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box } from "@gluestack-ui/themed";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { AuthContext } from "@contexts/AuthContext";

export function Routes() {
  // bg geral da aplicação
  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  // precisamos do useContext para acessar o conteúdo do contexto
  const contextData = useContext(AuthContext);
  console.log("usuário logado =>", contextData);

  return (
    // o box por volta é para evitar que a tela fique branca qd muda a rota
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
        {/* <AppRoutes /> */}
      </NavigationContainer>
    </Box>
  );
}
