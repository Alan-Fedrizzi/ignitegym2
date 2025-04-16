import { ScrollView, TouchableOpacity } from "react-native";
import { Center, VStack, Text, Heading, useToast } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { Controller, useForm } from "react-hook-form";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  confirmPassword: string;
};

export function Profile() {
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/Alan-Fedrizzi.png"
  );

  const toast = useToast();
  const { user } = useAuth();
  const { control, handleSubmit } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

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
        return toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              id="id"
              title="Imagem muito grande!"
              description="Essa imagem é muito grande. Escolha uma de até 5MB."
              action="error"
              onClose={() => toast.close(id)}
            />
          ),
        });
        // Alert to react-native
        // return Alert.alert(
        //   "Essa imagem é muito grande. Escolha uma de até 5MB."
        // );
      }

      setUserPhoto(photoUri);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data);
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

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
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  alternateStyle
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  isReadOnly
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  alternateStyle
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
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
            <Controller
              control={control}
              name="oldPassword"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  isPassword
                  alternateStyle
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova senha"
                  isPassword
                  alternateStyle
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirme a nova senha"
                  isPassword
                  alternateStyle
                  onChangeText={onChange}
                />
              )}
            />

            <Button
              title="Atualizar"
              onPress={handleSubmit(handleProfileUpdate)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
