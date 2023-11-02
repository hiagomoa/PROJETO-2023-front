import { API_HOST } from "@/common/utils/config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/auth.context";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ModalProfessor } from "../modals/ModalProfessor";
import { Container } from "./Container";

export const LayoutAlunos = ({ children }) => {
  const { user, signOut } = useContext(AuthContext);
  const methods = useForm();

  async function handleChangePassword(data: any) {
    const payload = {
      ...data,
      userID: user.id,
    };

    await fetch(
      API_HOST +
        `/auth/change-password/?last=${payload.lastPassword}&new=${payload.newPassword}&confirmation=${payload.confirmationPassword}&user=${user.id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ).then((r) =>
      r.status === 200
        ? toast.success("Senha alterada com sucesso!")
        : toast.error("Erro ao alterar senha")
    );
  }
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [v3, setV3] = useState("");


  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box bg="blueglobal" color="white">
        <Container>
          <Flex justify="space-between" p={3}>
            <Box>
              <Flex alignItems="center" gap={10}>
                <Flex gap={3} alignItems="center">
                  <Avatar name={String(user?.name)} />
                  <Box>
                    <Text fontSize="sm">Engenharia de Computação</Text>
                    <Text fontSize="sm">{user?.name} </Text>
                    <Text fontSize="sm">RA: 1865658</Text>
                  </Box>
                  <Dialog open={open} modal onOpenChange={setOpen}>
                    <DialogTrigger
                      onClick={() => setOpen(!open)}
                      className="text-sm"
                    >
                      TROCAR SENHA
                    </DialogTrigger>
                    <form
                      className="flex items-center justify-center"
                      {...methods}
                      onSubmit={methods.handleSubmit(handleChangePassword)}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex justify-between items-center">
                            Trocar senha
                          </DialogTitle>
                        </DialogHeader>

                        <div>
                          <Label>Senha antiga</Label>
                          <Input
                            onChange={(e) => setV1(e.target.value)}
                            value={v1}
                            className="mt-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:ring-[#4E5B9F]"
                            type="password"
                          />
                        </div>
                        <div>
                          <Label>Nova senha</Label>
                          <Input
                            onChange={(e) => setV2(e.target.value)}
                            value={v2}
                            className="mt-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:ring-[#4E5B9F]"
                            type="password"
                          />
                        </div>
                        <div>
                          <Label>Repita a nova senha</Label>
                          <Input
                            onChange={(e) => setV3(e.target.value)}
                            value={v3}
                            className="mt-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:ring-[#4E5B9F]"
                            type="password"
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleChangePassword({
                                lastPassword: v1,
                                newPassword: v2,
                                confirmationPassword: v3,
                              });
                            }}
                            className="bg-[#4e5b9f] hover:bg-[#4e5b9f]/50"
                          >
                            Alterar senha
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </form>
                  </Dialog>
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
  const { signOut, user } = useContext(AuthContext);
  const modalprofessor = useRef();

  const methods = useForm();
  const { register, handleSubmit } = methods;

  async function handleChangePassword(data: any) {
    const payload = {
      ...data,
      userID: user.id,
    };

    await fetch(
      API_HOST +
        `/auth/change-password/?last=${payload.lastPassword}&new=${payload.newPassword}&confirmation=${payload.confirmationPassword}&user=${user.id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ).then((r) =>
      r.status === 200
        ? toast.success("Senha alterada com sucesso!")
        : toast.error("Erro ao alterar senha")
    );
  }
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box bg="grayglobal" color="white">
        <Container>
          <Flex justify="space-between" p={3}>
            <Box>
              <Flex alignItems="center" gap={10}>
                <Flex gap={3} alignItems="center">
                  <Avatar name={String(user?.name)} />
                  <Text>{user?.name}</Text>
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
  const { signOut, user } = useContext(AuthContext);
  const router = useRouter();
  const methods = useForm({
    mode: "onChange",
  });

  async function handleChangePassword(data: any) {
    const payload = {
      lastPassword: data.lastPassword,
      newPassword: data.newPassword,
      confirmationPassword: data.confirmationPassword,
      userID: user.id,
    };


    await fetch(
      API_HOST +
        `/auth/change-password/?last=${payload.lastPassword}&new=${payload.newPassword}&confirmation=${payload.confirmationPassword}&user=${user.id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ).then((r) =>
      r.status === 200
        ? toast.success("Senha alterada com sucesso!")
        : toast.error("Erro ao alterar senha")
    );
  }

  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [v3, setV3] = useState("");


  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box bg="greenglobal" color="white">
        <Container>
          <Flex justify="space-between" p={3}>
            <Box>
              <Flex gap={3} alignItems="center">
                <Avatar name={String(user?.name)} />
                <Text>{user?.name}</Text>
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

              <Dialog open={open} modal onOpenChange={setOpen}>
                <DialogTrigger
                  onClick={() => setOpen(!open)}
                  className="text-sm"
                >
                  TROCAR SENHA
                </DialogTrigger>
                <form
                  className="flex items-center justify-center"
                  {...methods}
                  onSubmit={methods.handleSubmit(handleChangePassword)}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex justify-between items-center">
                        Trocar senha
                      </DialogTitle>
                    </DialogHeader>

                    <div>
                      <Label>Senha antiga</Label>
                      <Input
                        onChange={(e) => setV1(e.target.value)}
                        value={v1}
                        className="mt-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:ring-[#4E5B9F]"
                        type="password"
                      />
                    </div>
                    <div>
                      <Label>Nova senha</Label>
                      <Input
                        onChange={(e) => setV2(e.target.value)}
                        value={v2}
                        className="mt-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:ring-[#4E5B9F]"
                        type="password"
                      />
                    </div>
                    <div>
                      <Label>Repita a nova senha</Label>
                      <Input
                        onChange={(e) => setV3(e.target.value)}
                        value={v3}
                        className="mt-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:ring-[#4E5B9F]"
                        type="password"
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleChangePassword({
                            lastPassword: v1,
                            newPassword: v2,
                            confirmationPassword: v3,
                          });
                        }}
                        className="bg-[#4e5b9f] hover:bg-[#4e5b9f]/50"
                      >
                        Alterar senha
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
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
