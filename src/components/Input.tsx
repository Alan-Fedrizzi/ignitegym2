import { useState } from "react";
import { ComponentProps } from "react";
import {
  Input as GluestackInput,
  InputField,
  InputSlot,
  InputIcon,
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { Eye, EyeOff, X } from "lucide-react-native";

type Props = ComponentProps<typeof InputField> & {
  isReadOnly?: boolean;
  errorMessage?: string | null;
  isInvalid?: boolean;
  isPassword?: boolean;
};

export function Input({
  isReadOnly = false,
  errorMessage = null,
  isInvalid = false,
  isPassword = false,
  onChangeText,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid;
  const [showPassword, setShowPassword] = useState(false);

  function handleClearInput() {
    if (onChangeText) onChangeText("");
  }

  function handleTogglePassword() {
    setShowPassword((showState) => !showState);
  }

  return (
    <FormControl isInvalid={invalid} w="$full" mb="$4">
      <GluestackInput
        isInvalid={isInvalid}
        h="$14"
        borderWidth="$0"
        borderRadius="$md"
        // $focus-bgColor="red"
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? "$red500" : "$green500",
        }}
        $invalid={{
          borderWidth: 1,
          borderColor: "$red500",
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField
          bg="$gray700"
          color="$white"
          px="$4"
          fontFamily="$body"
          placeholderTextColor="$gray300"
          type={isPassword && !showPassword ? "password" : "text"}
          onChangeText={onChangeText}
          {...rest}
        />
        {isPassword && (
          <InputSlot onPress={handleTogglePassword} pr="$3" bg="$gray700">
            <InputIcon
              as={showPassword ? Eye : EyeOff}
              size="lg"
              color="$gray300"
            />
          </InputSlot>
        )}
        <InputSlot onPress={handleClearInput} pr="$4" bg="$gray700">
          <InputIcon as={X} size="lg" color="$gray300" />
        </InputSlot>
      </GluestackInput>

      <FormControlError>
        <FormControlErrorText color="$red500">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
