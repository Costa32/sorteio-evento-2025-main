"use client";

import Image from "next/image";
import { Button, Flex, Text, Spinner, CardHeader, CardBody, Box, Card, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';

import { usersApi } from "@/services/users";
import { useSweetAlert } from "@/hooks/useAlert";
import { vinculo_options } from "@/utils/vinculos";
import { estados_brevo } from "@/utils/estados";


interface User {
    id: string;
    name: string;
    draw_number: string;
    last_name: string;
    cpf: string;
    email: string;
    other_email: string;
    cellphone: string;
    whatsapp: string;
    tel: string;
    state: string;
    city: string;
    linked_institution: string;
    occupation: string;
    institution: string;
    job_position: string;
}

export default function Usuarios() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const router = useRouter();

    const { showAlert } = useSweetAlert();

    useEffect(() => {
        const userId = Array.isArray(params.id) ? params.id[0] : params.id;

        if (userId) {
            usersApi.getUsers({})
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        setUsers(res.data);
                    } else {
                        showAlert({
                            icon: "error",
                            title:
                                "Erro ao buscar usuários!",
                            timer: 3000,
                            showConfirmButton: false,
                            color: "#911",
                        });
                    }
                })
                .catch((err) => {
                    showAlert({
                        icon: "error",
                        title:
                            "Erro ao buscar usuários!",
                        text: `erro: ${err.message.value}`,
                        timer: 3000,
                        showConfirmButton: false,
                        color: "#911",
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
            showAlert({
                icon: "error",
                title:
                    "Erro ao buscar usuários!",
                text: "Sem o id na url não podemos exibir os usuários",
                timer: 3000,
                showConfirmButton: false,
                color: "#911",
            });
        }
    }, [params.id]);


    return (
        <Flex backgroundColor="#517C22" justify='center' align='center' minW="100vw" minH="100vh">
            <Flex backgroundColor="white" align='center' flexDir='column' m="2rem 0" padding={["2rem 1rem", "2rem 1rem", "3rem 2rem"]} width="80%" borderRadius={10}>
                <Flex w="100%" justify={["center", "center", "space-between"]} align="center" flexDir={["column", "column", "row"]}>
                    <Image
                        src="/assets/logo-inaff.png"
                        alt="Logo Inaff"
                        width={150}
                        height={50}
                    />
                    <Image
                        src="/assets/header_sbrafh.png"
                        alt="Logo Jaff"
                        width={200}
                        height={50}
                    />
                </Flex>

                {loading && (
                    <Flex w="100%" align='center' justify="center" mt={4}>
                        <Spinner color="#517C22" size="xl" />
                        <Text ml={2} color="#517C22">Carregando informações dos usuários...</Text>
                    </Flex>
                )}

                {!loading && !users.length && (
                    <Flex w="100%" align='center' justify="center" mt={4} flexDir="column">
                        <Text color="red.500" fontSize="xl" fontWeight="bold">Não foi possível carregar as informações dos usuários.</Text>
                        <Text mt={2} color="gray.600">Por favor, verifique se o ID está correto na URL.</Text>
                        <Button mt={4} p="0.25rem 0.5rem" bgColor="#517C22" fontSize={[16, 16, 18]} color="white" fontWeight="bold" onClick={() => router.push("/")}>Voltar</Button>
                    </Flex>
                )}

                {!loading && !!users.length && (
                    <Flex w="100%" align='center' flexDir='column'  >
                        <Text textAlign="justify" color="#517C22" fontSize={[24, 24, 40]} fontWeight={800}>Estes são os usuários cadastrados:</Text>

                        {users?.toSorted((a, b) => parseInt(a.draw_number) - parseInt(b.draw_number)).map(user => (
                            <Card.Root key={user?.id} mt="2rem" backgroundColor="white" color="#517C22" fontSize="18px" w="100%" p="1rem" border="2px solid #517C22" borderRadius="8px">
                                <CardHeader fontWeight={800} borderBottom="1px solid #517c22" mb={4}>
                                    {`${user?.name} ${user?.last_name}`}
                                </CardHeader>
                                <CardBody>
                                    <Grid gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr 1fr"]} gap={1}>
                                        <Box>
                                            <Text textAlign="center" fontWeight={800}>Número do sorteio:</Text>
                                            <Text textAlign="center">{user?.draw_number}</Text>
                                        </Box>
                                        <Box>
                                            <Text textAlign="center" fontWeight={800}>Email:</Text>
                                            <Text textAlign="center">{user?.email}</Text>
                                        </Box>
                                        <Box>
                                            <Text textAlign="center" fontWeight={800}>Telefone/Celular:</Text>
                                            <Text textAlign="center">{user?.cellphone ?? user?.whatsapp ?? user?.tel ?? "Não informado"}</Text>
                                        </Box>
                                        <Box>
                                            <Text textAlign="center" fontWeight={800}>Cidade:</Text>
                                            <Text textAlign="center">{user?.city}</Text>
                                        </Box>
                                        <Box>
                                            <Text textAlign="center" fontWeight={800}>Estado:</Text>
                                            <Text textAlign="center">{estados_brevo?.find(est => est.idBrevo === parseInt(user?.state))?.sigla ?? "Não informado"}</Text>
                                        </Box>
                                        <Box>
                                            <Text textAlign="center" fontWeight={800}>Vínculo:</Text>
                                            <Text textAlign="center">{vinculo_options?.find(vinc => vinc.value === user?.linked_institution)?.label ?? "Não informado"}</Text>
                                        </Box>
                                        <Box>
                                            <Text textAlign="center" fontWeight={800}>Profissão:</Text>
                                            <Text textAlign="center">{user?.occupation}</Text>
                                        </Box>
                                        <Box>
                                            <Text textAlign="center" fontWeight={800}>Instituição:</Text>
                                            <Text textAlign="center">{user?.institution}</Text>
                                        </Box>
                                    </Grid>

                                </CardBody>
                            </Card.Root>
                        ))}


                    </Flex>
                )}


            </Flex>
        </Flex>
    );
}