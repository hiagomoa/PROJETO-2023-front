import { FormInput } from "@/common/components/inputs/FormInput";
import { Container } from "@/common/components/layout/Container";
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
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log(data);
    await signIn(data.email, data.password);
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
