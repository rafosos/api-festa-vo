import { Stats } from "@/classes/Stats";
import { deletar, get, post, put } from "./service_base";
import { Convidado } from "@/classes/Convidado";

export default function ConvidadoService(){
    
    const getConvidados = () => {
        const promise = get<Convidado[]>("/convidados");
        return promise.then(res => res.data);
    }

    const novoConvidado = (convidado: Convidado) => {
        const promise = post<Convidado>("/", convidado);
        return promise.then(res => res.data);
    }

    const getStats = () => {
        const promise = get<Stats>("/stats");
        return promise.then(res => JSON.parse(res.data));
    }

    const getConvidadoNome = (nome: string) => {
        const promise = get<Convidado>(`/convidado/${nome}`);
        return promise.then(res=> res.data);
    }

    const updateConvidado = (nomeOriginal: string, convidado: Convidado) => {
        const promise = put<Convidado>(`/${nomeOriginal}`, convidado);
        return promise.then(res => res.data);
    }

    const apagarConvidado = (nome: string) => {
        const promise = deletar<boolean>(`/${nome}`);
        return promise.then(res => res.data);
    }

    return {getConvidados, novoConvidado, getStats, getConvidadoNome, updateConvidado, apagarConvidado}
} 