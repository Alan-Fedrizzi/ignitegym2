import { Heading, HStack, Text, VStack, Icon } from "@gluestack-ui/themed";
import { LogOut } from "lucide-react-native";

import { api } from "@services/api";
import { useAuth } from "@hooks/useAuth";
import { UserPhoto } from "./UserPhoto";
import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { TouchableOpacity } from "react-native";

export function HomeHeader() {
  const { user, signOut } = useAuth();

  // console.log(user.avatar);
  // para acessar o avatar no backend: http://localhost:3333/avatar/e894253b6c1a317abe64-nome_e_tal.png
  // `${api.defaults.baseURL}/avatar/${user.avatar}`

  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <UserPhoto
        // source={{ uri: "https://github.com/Alan-Fedrizzi.png" }}
        // source={user.avatar ? { uri: user.avatar } : defaultUserPhotoImg}
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        alt="Foto do usuário"
        w="$16"
        h="$16"
      />

      <VStack flex={1}>
        {/* flex={1} empurra o ícone para a direita */}
        <Text color="$gray100" fontSize="$sm">
          Olá,
        </Text>
        <Heading color="$gray100" fontSize="$md">
          {user.name}
        </Heading>
      </VStack>

      {/* não funciona, não reconhece nossas cores
      <LogOut color='$gray200' />
      temos que usar em conjunto com o Icon o gs */}
      <TouchableOpacity onPress={signOut}>
        <Icon as={LogOut} color="$gray200" size="xl" />
      </TouchableOpacity>
    </HStack>
  );
}
