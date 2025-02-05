export interface Stats{
    status: Status;
    convites: Convites;
    total: number;
}

interface Status{
    NAO_RESPONDIDO: number;
    TALVEZ: number;
    CONFIRMADO: number;
    NEGADO: number;
}

interface Convites{
    "0": number //false
    "1": number //true
}