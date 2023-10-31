import { FormInput } from "@/common/components/inputs/FormInput";
import { Container } from "@/common/components/layout/Container";
import { API_HOST } from "@/common/utils/config";
import { getRedirectUrl } from "@/common/utils/getRedirectUrl";
import { AuthContext } from "@/context/auth.context";
import {
  Box,
  Button,
  Flex,
  Img,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
  password: yup.string().required("Campo obrigatório"),
});

const Index = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { signIn, user } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    const checkRedirect = async () => {
      if (user) {
        const url = await getRedirectUrl(user?.role);
        router.replace(url);
      }
    };

    checkRedirect();
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const forgotMethods = useForm({});
  const [result, setResult] = useState("");

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log(data);
    await signIn(data.email, data.password);
  };

  const handleForgotPassword = async (data: { email: string }) => {
    await fetch(API_HOST + "/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    }).then((res) =>
      res.status === 200
        ? (toast.success("Email enviado com sucesso!"), setTabIndex(0))
        : toast.error("Email não encontrado!")
    );
  };

  return (
    <>
      <Flex bg="blueglobal" h="100vh" alignItems="center">
        <Container>
          <Flex alignItems="center">
            <Box w="55%">
              <Img src="/home/avatar.png" w="300px" />
            </Box>
            <Box
              w="45%"
              h="90vh"
              bg="white"
              borderTopLeftRadius="30px"
              borderBottomRightRadius="30px"
              p={5}
            >
              {tabIndex === 1 && (
                <button
                  className="appearence-none"
                  onClick={() => setTabIndex(0)}
                >
                  <ArrowLeftIcon className="w-8 h-8 " />
                </button>
              )}
              <Flex alignItems="center" h="100%" justify="center">
                <Box w="80%">
                  <Tabs index={tabIndex}>
                    <TabPanels>
                      <TabPanel>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Box display="grid" gap={5}>
                            <Text
                              fontWeight="bold"
                              fontSize="3xl"
                              color="#555555"
                            >
                              BEM-VINDO(A) DE VOLTA
                            </Text>

                            <FormInput
                              placeholder="Email"
                              {...register("email")}
                              error={errors.email?.message}
                            />
                            <FormInput
                              placeholder="Senha"
                              type="password"
                              {...register("password")}
                              error={errors.password?.message}
                            />
                            <Flex justify="flex-end">
                              <Button
                                background="transparent"
                                onClick={() => setTabIndex(1)}
                                sx={{
                                  _hover: {
                                    background: "transparent",
                                    color: "#319795",
                                  },
                                }}
                                fontWeight="bold"
                              >
                                Esqueceu sua senha?
                              </Button>
                            </Flex>
                            <Button
                              bg="#319795"
                              w="max"
                              color="white"
                              px={10}
                              type="submit"
                              isLoading={isSubmitting}
                            >
                              Entrar
                            </Button>
                          </Box>
                        </form>
                      </TabPanel>
                      <TabPanel>
                        <form
                          {...forgotMethods}
                          onSubmit={forgotMethods.handleSubmit(
                            handleForgotPassword
                          )}
                        >
                          <Box display="grid" h="100%" gap={5}>
                            <Text
                              fontWeight="bold"
                              fontSize="3xl"
                              color="#555555"
                            >
                              ESQUECEU SUA SENHA?
                            </Text>
                            <FormInput
                              {...forgotMethods.register("email")}
                              placeholder="Email do cadastro"
                            />
                            <Button
                              bg="#319795"
                              w="max"
                              color="white"
                              type="submit"
                              px={10}
                            >
                              Recuperar a senha
                            </Button>
                          </Box>
                        </form>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Flex>
    </>
  );
};
export default Index;
