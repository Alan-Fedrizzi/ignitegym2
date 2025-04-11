import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import {
  Heading,
  HStack,
  Image,
  VStack,
  Text,
  Icon,
} from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";

import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...props }: Props) {
  const { name, series, repetitions, thumb } = data;

  return (
    <TouchableOpacity {...props}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${thumb}`,
          }}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {name}
          </Heading>
          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
            {/* numberOfLines={2} coloca ... qd passa de 2 linhas */}
            {series} séries x {repetitions} repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  );
}
