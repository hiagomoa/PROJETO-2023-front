import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Container } from "./Container";
import { ModalProfessor } from "../modals/ModalProfessor";
import { useRef } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

export const LayoutAlunos = ({ children }) => {
  const { data: session } = useSession();
  return (
    <Box>
      <Box bg="blueglobal" color="white">
        <Container>
          <Flex justify="space-between" p={3}>
            <Box>
              <Flex alignItems="center" gap={10}>
                <Flex gap={3} alignItems="center">
                  <Avatar name={String(session?.user?.name)} />
                  <Box>
                    <Text fontSize="sm">Engenharia de Computação</Text>
                    <Text fontSize="sm">{session?.user?.name} </Text>
                    <Text fontSize="sm">RA: 1865658</Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>
            <Box>
              <Flex alignItems="center" h="100%">
                <Text as="button" onClick={() => signOut()}>
                  Logout
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box py={10}>{children}</Box>
    </Box>
  );
};

export const LayoutAdm = ({ children }) => {
  const { data: session } = useSession();
  const modalprofessor = useRef();
  return (
    <Box>
      <Box bg="grayglobal" color="white">
        <Container>
          <Flex justify="space-between" p={3}>
            <Box>
              <Flex alignItems="center" gap={10}>
                <Flex gap={3} alignItems="center">
                  <Avatar name={String(session?.user?.name)} />
                  <Text>{session?.user?.name}</Text>
                </Flex>
                <Text
                  as="button"
                  onClick={() => modalprofessor.current.onOpen()}
                >
                  Adicionar Professor
                </Text>
              </Flex>
            </Box>
            <Box>
              <Flex alignItems="center" h="100%">
                <Text as="button" onClick={() => signOut()}>
                  Logout
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box py={10}>{children}</Box>
      <ModalProfessor ref={modalprofessor} />
    </Box>
  );
};

export const LayoutProfessor = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <Box>
      <Box bg="greenglobal" color="white">
        <Container>
          <Flex justify="space-between" p={3}>
            <Box>
              <Flex gap={3} alignItems="center">
                <Avatar name={String(session?.user?.name)} />
                <Text>{session?.user?.name}</Text>
              </Flex>
            </Box>

            <Flex gap={10}>
              <Text
                as="button"
                fontSize="sm"
                onClick={() => router.push("/professor")}
              >
                EXERCÍCIOS
              </Text>
              <Text
                as="button"
                fontSize="sm"
                onClick={() => router.push("/professor/turmas")}
              >
                TURMAS
              </Text>
              <Text
                as="button"
                fontSize="sm"
                onClick={() => router.push("/professor/alunos")}
              >
                ALUNOS
              </Text>
            </Flex>

            <Box>
              <Flex alignItems="center" h="100%">
                <Text as="button" onClick={() => signOut()}>
                  Logout
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box py={10}>{children}</Box>
    </Box>
  );
};
