import { ScrollView, TouchableOpacity } from "react-native";
import { Center, VStack, Text, Heading, useToast } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { api } from "@services/api";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";

// type FormDataProps = {
//   name: string;
//   email: string;
//   password: string;
//   oldPassword: string;
//   confirmPassword: string;
// };
type FormDataProps = yup.InferType<typeof profileSchema>;

const profileSchema = yup.object().shape({
  name: yup.string().required("Informe o nome."),
  email: yup.string(),
  oldPassword: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null)),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 dígitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "A confirmação de senha não confere.")
    .when("password", {
      is: (val: any) => !!val,
      then: (schema) => schema.required("Informe a confirmação da senha."),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/Alan-Fedrizzi.png"
  );

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
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
      // console.log(photoInfo.size);

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

      // setUserPhoto(photoUri);
      // vamos mandar para o backend
      const fileExtension = photoUri.split(".").pop();
      // console.log(fileExtension);
      const photoFile = {
        name: `${user.name.replaceAll(
          " ",
          "_"
        )}.${fileExtension}`.toLowerCase(),
        uri: photoUri,
        type: `${photoSelected.assets[0].type}/${fileExtension}`,
      };
      console.log(photoFile);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    const updatedData = {
      name: data.name,
      password: data.password,
      old_password: data.oldPassword,
    };

    try {
      setIsUpdating(true);

      await api.put("/users", updatedData);

      const updatedUser = user;
      updatedUser.name = data.name;
      await updateUserProfile(updatedUser);
      console.log(updatedUser);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id="id"
            title="Perfil atualizado com sucesso!"
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível atualizar o perfil. Tente novamente mais tarde.";

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
      setIsUpdating(false);
    }
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
                  errorMessage={errors.name?.message}
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
                  errorMessage={errors.password?.message}
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
                  errorMessage={errors.confirmPassword?.message}
                />
              )}
            />

            <Button
              title="Atualizar"
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
