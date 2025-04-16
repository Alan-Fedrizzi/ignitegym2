import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SectionList } from "react-native";
import { Heading, VStack, Text, useToast } from "@gluestack-ui/themed";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { Loading } from "@components/Loading";
import { ToastMessage } from "@components/ToastMessage";

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);
  const toast = useToast();

  async function fecthHistory() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/history`);

      if (data) {
        setExercises(data);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi carregar o histórico.";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id="id"
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fecthHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading color="$gray200" fontSize="$md" mt="$10" mb="$3">
              {section.title}
            </Heading>
          )}
          style={{ paddingHorizontal: 32 }}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: "center" }
          }
          ListEmptyComponent={() => (
            <Text color="$gray200" textAlign="center">
              {/* {"\n"} é para quebrar linha como o <br></br> */}
              Não há exercícios registrados ainda. {"\n"}
              Vamos fazer execícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  );
}
