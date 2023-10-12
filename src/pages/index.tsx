import { FormInput } from "@/common/components/inputs/FormInput";
import { Container } from "@/common/components/layout/Container";
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
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { getRedirectUrl } from "@/common/utils/getRedirectUrl";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
  password: yup.string().required("Campo obrigatório"),
});

const Index = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    const checkRedirect = async () => {
      if (session) {
        const url = await getRedirectUrl(session?.user?.role);
        router.replace(url);
      }
    };

    checkRedirect();
  }, [session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Erro ao fazer login. Verifique suas credenciais.");
      } else if (result?.status === 200) {
        toast.success("Login bem-sucedido!");
      } else {
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error(
        "Ocorreu um erro ao fazer login. Tente novamente mais tarde."
      );
    }
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
                              <Text fontWeight="bold">Esqueceu sua senha?</Text>
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
                        <Box display="grid" gap={5}>
                          <Text
                            fontWeight="bold"
                            fontSize="3xl"
                            color="#555555"
                          >
                            ESQUECEU SUA SENHA?
                          </Text>
                          <FormInput placeholder="Email do cadastro" />
                          <Button bg="#319795" w="max" color="white" px={10}>
                            Recuperar a senha
                          </Button>
                        </Box>
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
