// import { useState } from "react";
import {
  Center,
  Heading,
  Image,
  Text,
  VStack,
  ScrollView,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";

import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export function SignUp() {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [passwordConfirm, setPasswordConfirm] = useState("");

  const { control, handleSubmit } = useForm<FormDataProps>();
  // const { control, handleSubmit } = useForm<FormDataProps>({
  //   defaultValues: {
  //     name: "nome do cara",
  //     email: "email@email.com",
  //     password: "senha do cara",
  //     passwordConfirm: "etc...",
  //   },
  // });

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleSignUp(data: FormDataProps) {
    // console.log(name, email, password, passwordConfirm);
    console.log(data);
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* <VStack flex={1} bg="$gray700"> */}
      {/* removemos a bg color, vamos colocar geral, no contexto de navegação */}
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          position="absolute"
        />
        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />
            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e seu corpo
            </Text>
          </Center>

          <Center flex={1} gap="$2">
            <Heading color="$gray100">Crie sua conta</Heading>

            <Controller
              control={control}
              name="name"
              // validação
              // se não de acordo, não chama o handleSubmit
              rules={{
                // texto que aparece para o campo
                required: "Informe o nome.",
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  // quem vai controlar o conteúdo do input não é mais o setName
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
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Confirme a Senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  // para o usuário pode enviar direto, sem ter que fechar o teclado e pressionar o button
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType="send"
                />
              )}
            />

            <Button
              title="Criar e acessar"
              onPress={handleSubmit(handleSignUp)}
            />

            {/* sem react-hook-form: */}
            {/* <Input placeholder="Nome" value={name} onChangeText={setName} /> 
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />
            <Input
              placeholder="Senha"
              secureTextEntry
              onChangeText={setPassword}
            />
            <Input
              placeholder="Confirme a Senha"
              secureTextEntry
              onChangeText={setPasswordConfirm}
            /> 

            <Button title="Criar e acessar" onPress={handleSignUp} /> */}
          </Center>

          <Button
            title="Voltar para o login"
            variant="outline"
            mt="$12"
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
