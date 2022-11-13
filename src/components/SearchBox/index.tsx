import { Box, Button, Flex, FormControl, Input } from "@chakra-ui/react";

interface ISearchBox {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SearchBox(props: ISearchBox) {
  const { onChange, onClick, onSubmit } = props;
  return (
      <FormControl>
        <Flex alignItems={"center"} flexWrap="nowrap" justify="center">
          <Input
            flexGrow="3"
            type="text"
            placeholder="Search"
            onChange={onChange}
            borderRadius="sm"
            maxW={"container.md"}
            borderRightRadius="none"
          />
          <Button
            flexGrow="0"
            borderRadius={"sm"}
            borderLeftRadius="none"
            color="whiteAlpha.900"
            fontWeight={"bold"}
            fontStyle="italic"
            bg={"teal.500"}
            fontSize={["sm", "md"]}
            onClick={onClick}
          >
            Search
          </Button>
        </Flex>
      </FormControl>
  );
}
