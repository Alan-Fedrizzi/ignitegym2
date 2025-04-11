import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
  useToast,
  Toast,
  ToastTitle,
} from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";

import { api } from "@services/api";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";

type RoutesParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true);
  const [sendingRegister, setSendingRegister] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();

  const { exerciseId } = route.params as RoutesParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/exercises/${exerciseId}`);

      if (data) {
        setExercise(data);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi carregar os detalhes do exercícios.";

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle>{title}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);
      await api.post(`/history`, { exercise_id: exerciseId });

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success" variant="outline">
            <ToastTitle>
              Parabéns! Exercício registrado no seu histórico.
            </ToastTitle>
          </Toast>
        ),
      });

      // redireciona para o histórico
      navigation.navigate("history");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi registrar o exercícios.";

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle>{title}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setSendingRegister(false);
    }
  }

  // carregamento inicial
  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <VStack p="$8">
            <Box rounded="$lg" mb="$3" overflow="hidden">
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt="Imagem do exercício"
                resizeMode="cover"
                w="$full"
                h="$80"
              />
            </Box>

            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
              <HStack
                alignItems="center"
                justifyContent="space-around"
                mb="$6"
                mt="$5"
              >
                <HStack>
                  <SeriesSvg />
                  <Text color="$gray200" ml="$2">
                    {exercise.series} séries
                  </Text>
                </HStack>
                <HStack>
                  <RepetitionsSvg />
                  <Text color="$gray200" ml="$2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              {/* qd marca como realizado, vai para histórico */}
              <Button
                title="Marcar como realizado"
                isLoading={sendingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
