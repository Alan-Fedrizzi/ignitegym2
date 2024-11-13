import { useState } from "react";
import { FlatList } from "react-native";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";

export function Home() {
  const [exercises, setExercises] = useState([
    "Puxada frontal",
    "Remada curvada",
    "Remada unilateral",
    "Levantamento terra",
    "Levantamento terra",
    "Levantamento terra",
    "Levantamento terra",
  ]);
  const [groups, setGroups] = useState([
    "Costas",
    "Bíceps",
    "Tríceps",
    "Ombros",
  ]);
  const [groupSelected, setGroupSelected] = useState("CSostas");

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            // isActive={groupSelected === item}
            // como é case sensitive:
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {/* <HStack>
        <Group
          name="Costas"
          isActive={groupSelected === "costa"}
          onPress={() => setGroupSelected("costa")}
        />
        <Group
          name="Ombro"
          isActive={groupSelected === "ombro"}
          onPress={() => setGroupSelected("ombro")}
        />
      </HStack> */}

      <VStack flex={1} px="$8">
        <HStack justifyContent="space-between" mb="$5" alignItems="center">
          <Heading color="$gray200" fontSize="$md">
            Exercícios
          </Heading>
          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <ExerciseCard />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
}
