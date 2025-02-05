import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import StyledText from "./StyledText";
import StyledTextInput from "./StyledTextInput";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";
import { Convidado, StatusConvidadoAPI } from "@/classes/Convidado";
import { useState } from "react";
import { colors, fonts } from "@/utils/constants";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import ConvidadoService from "@/services/convidados_service";
import { errorHandler } from "@/services/service_base";
import { useToast } from "react-native-toast-notifications";

interface Props{
    visible: boolean,
    onClose: () => void,
    convidado: Convidado
}

export function ModalConvidado({visible, onClose, convidado}: Props){
    const {textColor, theme} = useTheme();
    const [nome, setNome] = useState(convidado.nome);
    const [convite, setConvite] = useState(convidado.convite ?? false);
    const [presenca, setPresenca] = useState(convidado.status ?? StatusConvidadoAPI["Não respondido"]);
    const [loading, setLoading] = useState(false);
    const convidadoService = ConvidadoService();
    const toast = useToast()

    const salvar = () => {
        setLoading(true);
        if (!nome)
            toast.show("Convidado sem nome não entra! Preencha o nome, por favor >:(", {type: "error"});

        if(convidado.nome)
            convidadoService.updateConvidado(convidado.nome, {nome, status: StatusConvidadoAPI[presenca], convite})
                .then(res => {
                    onClose();
                    toast.show("Alterações salvas com sucesso!", {type: 'success'});
                })
                .catch(err => errorHandler(err, "Erro ao salvar as alterações :(\nVerifique se todos os campos estão preenchidos e tente novamente."))
                .finally(() => setLoading(false));
        else
            convidadoService.novoConvidado({nome, status: StatusConvidadoAPI[presenca], convite})
                .then(res => {
                    onClose();
                    toast.show("Novo convidado adicionado com successo!", {type: 'success'});
                })
                .catch(err => errorHandler(err, "Erro ao adicionar convidado :(\nVerifique se todos os campos estão preenchidos e tente novamente."))
                .finally(() => setLoading(false));
    }
            
    const deletar = () => {
        setLoading(true);
        convidadoService.apagarConvidado(nome)
           .then(res => {
                onClose();
                toast.show("Convidado apagado/desconvidado com sucesso! :p", {type: 'succcess'});
            })
            .catch(err => errorHandler(err, "Ops, não foi possivel deletar/desconvidar no momento, tente novamente por favor! Essa pessoa deve querer mesmo ir... ~_~"))
            .finally(() => setLoading(false));
    }

    const onValueChangePicker = (value: StatusConvidadoAPI) => {
        if (value == StatusConvidadoAPI.CONFIRMADO || value == StatusConvidadoAPI.NEGADO)
            setConvite(true);
        setPresenca(value);
    }

    return(
        <Modal
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[styles.container, styles[theme]]}>
                <View style={styles.header}>
                    <FontAwesome5 style={styles.iconeTitle} name="arrow-left" color={textColor} onPress={onClose}/>
                    <StyledText style={styles.txtTitle}>Convidado</StyledText>
                </View>
                
                <StyledText style={styles.label}>Nome:</StyledText>
                <StyledTextInput 
                    value={nome}
                    style={styles.txtInput}
                    onChangeText={(txt) => setNome(txt)}
                />
                
                <View style={styles.containerCheckbox}>
                    <StyledText style={styles.label}>Convite enviado?</StyledText>
                    <Checkbox
                        style={styles.checkbox}
                        value={!!convite}
                        onValueChange={setConvite}
                        color={convite ? colors.verde.padrao : colors.cinza.medio}
                    />
                </View>

                <StyledText style={styles.label}>Presença</StyledText>
                <View style={styles.txtInput}>
                    <Picker
                        style={styles.txtInput}
                        selectedValue={presenca}
                        onValueChange={(itemValue) => onValueChangePicker(itemValue)}
                    >
                        <Picker.Item label="Não respondido" value={StatusConvidadoAPI.NAO_RESPONDIDO}/>
                        <Picker.Item label="Confirmado" value={StatusConvidadoAPI.CONFIRMADO}/>
                        <Picker.Item label="Negado" value={StatusConvidadoAPI.NEGADO}/>
                        <Picker.Item label="Talvez" value={StatusConvidadoAPI.TALVEZ}/>
                    </Picker>
                </View>

                <TouchableOpacity style={styles.botaoSalvar} onPress={salvar} disabled={loading}>
                    {loading ? 
                        <ActivityIndicator color={colors.branco.padrao} size={"small"}/> :
                        <StyledText style={styles.txtBotaoSalvar}>SALVAR</StyledText>
                    }
                </TouchableOpacity>

                {nome ? <TouchableOpacity style={styles.botaoDeletar} onPress={deletar} disabled={loading}>
                    <StyledText style={styles.txtBotaoDeletar}>DELETAR</StyledText>
                </TouchableOpacity> : null}

                <TouchableOpacity style={styles.botaoCancelar} onPress={onClose} disabled={loading}>
                    <StyledText style={styles.txtBotaoCancelar}>CANCELAR</StyledText>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding: 15
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
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconeTitle:{
        position: 'absolute',
        top: 5,
        left: 0,
        fontSize: 24
    },
    txtTitle:{
        textAlign: 'center',
        fontSize: 24,
        fontFamily: fonts.padrao.Bold700,
        textAlignVertical: 'center'
    },
    label:{
        fontSize: 20
    },
    txtInput:{
        lineHeight: 30,
        backgroundColor: colors.branco.padrao,
        borderWidth: 1,
        borderColor: colors.cinza.escuro,
        borderRadius: 15,
        color: colors.preto.padrao,
        paddingHorizontal: 10
    },
    containerCheckbox:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 25,
        alignItems: 'center'
    },
    checkbox:{
    },
    containerPicker:{
        borderRadius: 25
    },
    picker:{
        width: "100%"
    },
    botaoSalvar:{
        backgroundColor: colors.verde.padrao,
        padding: 10,
        borderRadius: 25,
        marginVertical: 25
    },
    txtBotaoSalvar:{
        textAlign: 'center'
    },
    botaoDeletar:{
        backgroundColor: colors.vermelho.padrao,
        padding: 10,
        borderRadius: 25,
        marginBottom: 25
    },
    txtBotaoDeletar:{
        textAlign: 'center'
    },
    botaoCancelar:{
        backgroundColor: colors.cinza.escuro,
        padding: 10,
        borderRadius: 25
    },
    txtBotaoCancelar:{
        textAlign: 'center'
    }
})