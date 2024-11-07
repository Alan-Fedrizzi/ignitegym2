import { ComponentProps } from "react";
import { Image } from "@gluestack-ui/themed";

type Props = ComponentProps<typeof Image>;

export function UserPhoto({ ...rest }: Props) {
  return (
    <Image
      rounded="$full"
      borderWidth="$2"
      borderColor="$gray400"
      // caso a imagem não carregue ou demore para carregar, por isso do bg
      backgroundColor="$gray500"
      {...rest}
    />
  );
}
