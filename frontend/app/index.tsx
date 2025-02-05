import { Convidado, StatusConvidado, StatusConvidadoAPI } from "@/classes/Convidado";
import { Stats } from "@/classes/Stats";
import { ModalConvidado } from "@/components/ModalConvidado";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import { useTheme } from "@/components/ThemeContext";
import ConvidadoService from "@/services/convidados_service";
import { errorHandler } from "@/services/service_base";
import { colors, fonts } from "@/utils/constants";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Index() {
    const {theme, setTheme, textColor} = useTheme();
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [convidadosFiltrados, setConvidadosFiltrados] = useState<Convidado[]>([]);
    const [convidado, setConvidado] = useState<Convidado | {}>();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<Stats>();
    const [filtro, setFiltro] = useState("");
    const [filtroPresenca, setFiltroPresenca] = useState<StatusConvidadoAPI | null>(null);

    const convidadoService = ConvidadoService();

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => filtrarConvidados(), 
    [convidados, filtro, filtroPresenca]);

    const filtrarConvidados = () => {
        if(filtro && filtroPresenca)
            setConvidadosFiltrados(
                convidados.filter(c => 
                    c.nome.toLowerCase().includes(filtro) &&
                    c.status == filtroPresenca
                )
            );
        else if (filtro && !filtroPresenca)
            setConvidadosFiltrados(
                convidados.filter(c => 
                c.nome.toLowerCase().includes(filtro)
            )
        );
        else if (!filtro && filtroPresenca)
            setConvidadosFiltrados(
                convidados.filter(c => 
                    c.status == filtroPresenca
                )
            );
        else
            setConvidadosFiltrados(convidados);
    }

    const changeFiltroPresenca = (status: StatusConvidadoAPI) => {
        setFiltroPresenca((prev) => prev == status ? null : status);
    }
  
    const changeTheme = () => 
        setTheme(theme == "light"? "dark" : "light");
    
    const refresh = () => {
        getConvidados();
        getStats();
    }

    const getConvidados =() => {
        setLoading(true);
        convidadoService.getConvidados()
            .then(res => setConvidados(res))
            .catch(err => errorHandler(err, "Erro ao carregar os convidados :("))
            .finally(() => setLoading(false));
    }

    const getStats =() => {
        setLoading(true);
        convidadoService.getStats()
            .then(res => setStats(res))
            .catch(err => errorHandler(err, "Erro ao carregar as informações :("))
            .finally(() => setLoading(false));
    }

    const onCloseModal = () => {
        setConvidado(undefined);
        refresh();
    }
    
    return (<View style={[styles.container, styles[theme]]}>
        <StatusBar backgroundColor={colors[theme].background}/>
        {convidado? <ModalConvidado
            visible={!!convidado}
            convidado={convidado}
            onClose={onCloseModal} 
        /> : null}

        <FlatList
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
            data={convidadosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome))}
            contentContainerStyle={[styles[theme], styles.containerFlatlist]}
            ListHeaderComponent={<>
                <Image source={require("@/assets/images/vo_breja_crop.jpg")} style={styles.foto}/>
                <View style={styles.header}>
                    <StyledText style={styles.title}>80 da Edite</StyledText>
                    <TouchableOpacity onPress={changeTheme} style={styles.botaoThemeMode}>                        
                        <FontAwesome5 name={theme == "light"? "moon" : "sun"} size={24} color={textColor} />
                    </TouchableOpacity>
                </View> 


                {stats && <>
                    <StyledText style={styles.titleStats}>Convites:</StyledText>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={Object.keys(StatusConvidado)}
                        renderItem={({item}) => 
                            <TouchableOpacity 
                                style={[
                                    styles[theme], 
                                    styles.cardStats, 
                                    filtroPresenca ? filtroPresenca == item ? styles[theme] : 
                                        theme == "dark" ? styles.cardApagadoDark : styles.cardApagadoLight : {}
                                ]} 
                                onPress={() => changeFiltroPresenca(item)}
                            >
                                <StyledText>{StatusConvidado[item]}</StyledText>
                                <StyledText>{stats.status[item] ?? 0}</StyledText>
                            </TouchableOpacity>
                        }
                        horizontal
                        contentContainerStyle={styles.containerStats}
                    />
                </>}

                <View style={styles.containerSubtitulo}>
                    <View style={styles.containerPesquisa}>
                        <StyledTextInput
                            placeholder="Pesquisar convidado"
                            value={filtro}
                            onChangeText={(txt) => setFiltro(txt.toLowerCase())}
                            style={styles.txtInput}
                            />
                        <AntDesign name="plussquare" size={45} color={colors.verde.padrao} onPress={() => setConvidado({})} />
                    </View>
                    <StyledText style={styles.total}>Total: {convidadosFiltrados.length}</StyledText>
                </View>
            </>}
            
            renderItem={({item}) => 
                <TouchableOpacity style={[styles.card, styles[theme]]} onPress={() => setConvidado(item)}>
                    <StyledText style={styles.nome}>{item.nome}</StyledText>
                    
                    <View style={styles.statsConvidado}>
                        <StyledText style={[styles.convidado]}>Convite:
                            <StyledText style={[styles[theme], styles.convidadoValue]}> {item.convite ? "" : "não "}enviado</StyledText>
                        </StyledText>
                        <StyledText style={[styles[theme], styles.status]}>Presença:
                            <StyledText style={[styles[theme], styles.status, 
                                item.status == StatusConvidadoAPI.Confirmado && {color: colors.verde.padrao},
                                item.status == StatusConvidadoAPI.Negado && {color: colors.vermelho.padrao},
                                ]}> {StatusConvidado[item.status]}</StyledText>
                        </StyledText>
                    </View>
                </TouchableOpacity>
            }
            ListEmptyComponent={convidados.length == 0 ? 
                <StyledText style={styles.txtListEmpty}>
                    Parece que não tem convidados na lista ainda. Adicione um agora pra tornar a festa mais gostosa!
                </StyledText>
                :
                <StyledText style={styles.txtListEmpty}>
                    Parece que não tem convidados com esse filtro... Tente com um filtro diferente :D
                </StyledText>
            }
        />
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    containerFlatlist:{
        gap: 15
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        fontFamily: fonts.padrao.Bold700,
        fontSize: 35,
    },
    botaoThemeMode:{
        position: 'absolute',
        top: 10,
        right: 10
    },
    foto:{
        height: 160,
        width: '100%',
        resizeMode: 'cover',
        alignSelf: 'center',
    },
    containerStats:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 15,
        paddingTop: 5,
        gap: 10,
        marginHorizontal: 10
    },
    titleStats:{
        fontFamily: fonts.padrao.Bold700,
        fontSize: 20,
        marginHorizontal: 10
    },
    cardStats:{
        flex:1,
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardApagadoDark: {
        borderColor: colors.cinza.escuro
    },
    cardApagadoLight: {
        borderColor: colors.cinza.clarinho
    },
    containerSubtitulo:{
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    containerPesquisa:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtitle:{
        flex:1
    },
    txtInput:{
        lineHeight: 30,
        flex:1,
        backgroundColor: colors.branco.padrao,
        borderWidth: 1,
        borderColor: colors.cinza.escuro,
        borderRadius: 15,
        color: colors.preto.padrao,
        paddingHorizontal: 10
    },
    total:{
        flex:1,
        textAlign: 'right',
        fontStyle: "italic"
    },
    card:{
        borderWidth: 1,
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 10
    },
    nome:{
        fontSize: 23,
        fontFamily: fonts.padrao.Bold700
    },
    statsConvidado:{

    },
    convidado:{

    },
    convidadoValue:{
        fontStyle: "italic"
    },
    status:{

    },
    dark:{
        borderColor: colors.branco.padrao,
        color: colors.dark.text,
        backgroundColor: colors.dark.background
    },
    light:{
        borderColor: colors.cinza.escuro,
        color: colors.light.text,
        backgroundColor: colors.light.background
    },
    txtListEmpty:{
        textAlign: "center",
        flex:1,
        marginHorizontal: 25
    }
});