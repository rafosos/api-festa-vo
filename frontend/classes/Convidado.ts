export interface Convidado{
    nome: string;
    convite: boolean;
    status: StatusConvidadoAPI
}

export enum StatusConvidado{
    NAO_RESPONDIDO = "Não respondido", 
    TALVEZ = "Talvez", 
    NEGADO = "Negado", 
    CONFIRMADO ="Confirmado"
}

export enum StatusConvidadoAPI{
    "Não respondido" = "NAO_RESPONDIDO",
    "NAO_RESPONDIDO" = "NAO_RESPONDIDO", 
    "Talvez" = "TALVEZ",
    "TALVEZ" = "TALVEZ",
    "Negado" = "NEGADO",
    "NEGADO" = "NEGADO", 
    "Confirmado" = "CONFIRMADO",
    "CONFIRMADO" = "CONFIRMADO"
}