import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { Center, VStack, Text, Heading } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";

export function Profile() {
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/Alan-Fedrizzi.png"
  );

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        // base64: true,
      });

      if (photoSelected.canceled) return;

      // in bytes, mas é optional, pode não vir..
      // console.log(photoSelected.assets[0].fileSize);
      // vamos usar o Expo FileSystem

      // console.log(photoSelected.assets[0]);
      const photoUri = photoSelected.assets[0].uri;

      if (!photoUri) return;

      const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
        size: number;
        // para dizer que dentro vai ter um size que é number
      };
      console.log(photoInfo.size);

      const isBiggerThanFiveMb = photoInfo.size / 1024 / 1024 > 5;

      if (photoInfo.size && isBiggerThanFiveMb) {
        return Alert.alert(
          "Essa imagem é muito grande. Escolha uma de até 5MB."
        );
      }

      setUserPhoto(photoUri);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ToastMessage
        id="1"
        title="titulo"
        description="descricao"
        action="success"
        onClose={() => {}}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: userPhoto }}
            size="xl"
            alt="Foto do usuário"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Input value="Nome" bg="$gray600" isReadOnly />
            <Input value="email@email.com" bg="$gray600" isReadOnly />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
            <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
            <Input
              placeholder="Confirme a nova senha"
              bg="$gray600"
              secureTextEntry
            />

            <Button title="Atualizar" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
