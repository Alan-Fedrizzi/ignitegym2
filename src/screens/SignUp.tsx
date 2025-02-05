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
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
// para não dar erro no resolver... qd não havíamos feito todo o schema
// type FormDataProps = yup.InferType<typeof signUpSchema>;

const signUpSchema = yup.object().shape({
  name: yup.string().required("Informe o nome."),
  email: yup.string().email("E-mail inválido").required("Informe o e-mail."),
  password: yup
    .string()
    .required("Informe a senha.")
    .min(6, "A senha deve ter pelo menos 6 dígitos."),
  passwordConfirm: yup
    .string()
    .required("Confirme a senha.")
    .oneOf([yup.ref("password"), ""], "A confimação da senha não confere."),
});

export function SignUp() {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [passwordConfirm, setPasswordConfirm] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });
  // sem yup:
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormDataProps>();
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

  // sem axios
  async function handleSignUp(
    formData: Omit<FormDataProps, "passwordConfirm">
  ) {
    const response = await fetch("http://192.168.1.42:3333/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);
  }
  /*
  // sem async / await
  function handleSignUp(data: Omit<FormDataProps, "passwordConfirm">) {
    // console.log(name, email, password, passwordConfirm);
    // console.log(data);

    // android não vai entender o localhost, temos que colocar o ip da máquina
    fetch("http://192.168.1.42:3333/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then((data) => console.log(data));
    });
  }
  */

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
              // com yup, pode remover essa rule
              // rules={{
              //   // texto que aparece para o campo
              //   required: "Informe o nome.",
              // }}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  // quem vai controlar o conteúdo do input não é mais o setName
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            {/* {errors.name?.message && (
              <Text color="$white">{errors.name.message}</Text>
            )} */}

            <Controller
              control={control}
              name="email"
              // rules={{
              //   required: "Informe o e-mail.",
              //   pattern: {
              //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              //     message: "E-mail inválido",
              //   },
              // }}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />
            {/* {errors.email?.message && (
              <Text color="$white">{errors.email.message}</Text>
            )} */}

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
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
                  errorMessage={errors.passwordConfirm?.message}
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
