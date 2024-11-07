import { Heading, HStack, Text, VStack, Icon } from "@gluestack-ui/themed";
import { LogOut } from "lucide-react-native";

import { UserPhoto } from "./UserPhoto";

export function HomeHeader() {
  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <UserPhoto
        source={{ uri: "https://github.com/Alan-Fedrizzi.png" }}
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
          Rodrigo Gonçalves
        </Heading>
      </VStack>

      {/* não funciona, não reconhece nossas cores
      <LogOut color='$gray200' />
      temos que usar em conjunto com o Icon o gs */}
      <Icon as={LogOut} color="$gray200" size="xl" />
    </HStack>
  );
}
